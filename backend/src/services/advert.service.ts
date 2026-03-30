import * as accountTypeRepo from '../db/repos/account-type.repo';
import * as advertViewStatsRepo from '../db/repos/advert-view-stats.repo';
import * as advertRepo from '../db/repos/advert.repo';
import * as modelRepo from '../db/repos/model.repo';
import * as regionRepo from '../db/repos/region.repo';
import * as roleRepo from '../db/repos/role.repo';
import * as userRepo from '../db/repos/user.repo';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../errors/errors';

import {
  convertPrice,
  convertPriceWithRates,
  Currency,
  getLatestRates,
} from './currency.service';
import { emailService } from './email.service';
import { hasProfanity } from './profanity.service';

type AdvertListParams = advertRepo.AdvertListQuery;

type CreateAdvertDto = {
  title: string;
  description?: string;
  priceOriginal: number;
  currencyOriginal: Currency;
  modelId: number;
  regionId: number;
};

type UpdateAdvertDto = Partial<
  Pick<
    CreateAdvertDto,
    | 'title'
    | 'description'
    | 'priceOriginal'
    | 'currencyOriginal'
    | 'modelId'
    | 'regionId'
  >
>;

class AdvertService {
  private async notifyManagersAboutInactiveAdvert(
    advertId: number,
    ownerUserId: string,
  ): Promise<void> {
    const managerRole = await roleRepo.getRoleByName('manager');
    const managers = await userRepo.getByRoleId(managerRole.id);

    const recipients = managers.map((u) => u.email).filter(Boolean);
    if (!recipients.length) {
      return;
    }

    const subject = `Advertisement #${advertId} requires manager review`;
    const text = `Advertisement #${advertId} from user ${ownerUserId} became inactive after 3 failed profanity checks.`;
    const html = `
      <p>Advertisement <b>#${advertId}</b> requires manual review.</p>
      <p>Owner userId: <b>${ownerUserId}</b></p>
      <p>Reason: 3 failed profanity edit attempts (status set to <b>inactive</b>).</p>
    `;

    await Promise.all(
      recipients.map((email) =>
        emailService.sendEmail(email, subject, html, text),
      ),
    );
  }

  async recalcAllAdPrices() {
    const rates = await getLatestRates();
    const adverts = await advertRepo.listAllAdvertsForPriceRecalc();

    const updatedAt = new Date();

    for (const advert of adverts) {
      const amount = Number(advert.priceOriginal);
      const currency = advert.currencyOriginal as Currency;

      if (!Number.isFinite(amount)) {
        throw new InternalServerError(
          `Invalid stored priceOriginal for advertId=${advert.id}`,
        );
      }

      const converted = convertPriceWithRates(amount, currency, rates);

      await advertRepo.updateAdvertById(advert.id, {
        priceUsd: String(converted.priceUsd),
        priceEur: String(converted.priceEur),
        priceUah: String(converted.priceUah),
        updatedAt,
      });
    }

    return { updated: adverts.length };
  }

  async createAdvert(userId: string, payload: CreateAdvertDto) {
    const user = await userRepo.getById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (user.isBanned) {
      throw new BadRequestError('Banned users cannot create advertisements');
    }

    // Validate model and region to provide clear errors instead of FK violations
    await Promise.all([
      modelRepo.getModelById(payload.modelId),
      regionRepo.getRegionById(payload.regionId),
    ]);

    const accountType = await accountTypeRepo.getAccountTypeByName('basic');
    const isBasic = user.accountTypeId === accountType.id;

    if (isBasic) {
      const listingCount = await advertRepo.countListingsByUserId(userId);
      if (listingCount >= (accountType.maxListings ?? 1)) {
        throw new BadRequestError(
          'Basic account can only have one advertisement (active or pending). Delete or deactivate the existing one to create another.',
        );
      }
    }

    const { priceOriginal, currencyOriginal } = payload;
    const converted = await convertPrice(priceOriginal, currencyOriginal);

    const hasBadLanguage =
      hasProfanity(payload.title) ||
      (payload.description ? hasProfanity(payload.description) : false);

    const status = hasBadLanguage ? 'needs_edit' : 'active';
    const editAttempts = hasBadLanguage ? 1 : 0;

    const advert = await advertRepo.createAdvert({
      title: payload.title,
      description: payload.description ?? null,
      priceOriginal: String(priceOriginal),
      currencyOriginal,
      priceUsd: String(converted.priceUsd),
      priceEur: String(converted.priceEur),
      priceUah: String(converted.priceUah),
      modelId: payload.modelId,
      regionId: payload.regionId,
      userId,
      status,
      editAttempts,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Return the ad either way; client can check status and show warning if needs_edit
    return advert;
  }

  async updateAdvert(advertId: number, userId: string, dto: UpdateAdvertDto) {
    const advert = await advertRepo.getAdvertById(advertId);

    const caller = await userRepo.getById(userId);
    if (!caller) {
      throw new NotFoundError('User not found');
    }

    const [managerRole, adminRole] = await Promise.all([
      roleRepo.getRoleByName('manager'),
      roleRepo.getRoleByName('admin'),
    ]);

    const isOwner = advert.userId === userId;
    const isManagerOrAdmin =
      caller.roleId === managerRole.id || caller.roleId === adminRole.id;

    if (!isOwner && !isManagerOrAdmin) {
      throw new BadRequestError('You can update only your own advertisements');
    }

    if (advert.status === 'inactive' && !isManagerOrAdmin) {
      throw new BadRequestError(
        'Inactive advertisements cannot be updated; you can only delete them.',
      );
    }

    if (dto.regionId !== undefined) {
      await regionRepo.getRegionById(dto.regionId);
    }
    if (dto.modelId !== undefined) {
      await modelRepo.getModelById(dto.modelId);
    }

    let status = advert.status;
    let editAttempts = advert.editAttempts;

    let priceOriginal = Number(advert.priceOriginal);
    let currencyOriginal = advert.currencyOriginal as Currency;

    if (dto.priceOriginal !== undefined && dto.currencyOriginal !== undefined) {
      priceOriginal = dto.priceOriginal;
      currencyOriginal = dto.currencyOriginal;
    }

    const converted = await convertPrice(priceOriginal, currencyOriginal);

    if (dto.title || dto.description) {
      const newTitle = dto.title ?? advert.title;
      const newDescription = dto.description ?? advert.description ?? '';

      if (isManagerOrAdmin) {
        // Manager/admin bypass profanity and edit attempts and can reactivate
        status = 'active';
        editAttempts = 0;
      } else {
        const hasBadLanguage =
          hasProfanity(newTitle) || hasProfanity(newDescription);

        if (hasBadLanguage) {
          editAttempts = advert.editAttempts + 1;
          status = editAttempts >= 3 ? 'inactive' : 'needs_edit';
          if (status === 'inactive') {
            // Do not block update flow if notification fails.
            this.notifyManagersAboutInactiveAdvert(
              advert.id,
              advert.userId,
            ).catch((error) => {
              console.error(
                `Failed to notify managers for inactive advert #${advert.id}`,
                error,
              );
            });
          }
        } else {
          status = 'active';
          editAttempts = 0;
        }
      }
    }

    return advertRepo.updateAdvertById(advertId, {
      title: dto.title ?? advert.title,
      description: dto.description ?? advert.description,
      priceOriginal: String(priceOriginal),
      currencyOriginal,
      priceUsd: String(converted.priceUsd),
      priceEur: String(converted.priceEur),
      priceUah: String(converted.priceUah),
      modelId: dto.modelId ?? advert.modelId,
      regionId: dto.regionId ?? advert.regionId,
      status,
      editAttempts,
      updatedAt: new Date(),
    });
  }

  async deleteAdvert(advertId: number, userId: string) {
    const advert = await advertRepo.getAdvertById(advertId);
    const caller = await userRepo.getById(userId);

    if (!caller) {
      throw new NotFoundError('User not found');
    }

    const [managerRole, adminRole] = await Promise.all([
      roleRepo.getRoleByName('manager'),
      roleRepo.getRoleByName('admin'),
    ]);

    const isOwner = advert.userId === userId;
    const isManagerOrAdmin =
      caller.roleId === managerRole.id || caller.roleId === adminRole.id;

    // Owner can delete own adverts.
    // Non-owner deletion is allowed only for manager/admin and only for inactive adverts.
    if (!isOwner && !(isManagerOrAdmin && advert.status === 'inactive')) {
      throw new BadRequestError('You can delete only your own advertisements');
    }

    await advertRepo.deleteAdvertById(advertId);
  }

  async getAdvertById(id: number) {
    const advert = await advertRepo.getAdvertById(id);

    // fire-and-forget view increment
    advertViewStatsRepo
      .incrementView(advert.id, new Date())
      .catch(() => undefined);

    return advert;
  }

  listAdverts(params: AdvertListParams) {
    return advertRepo.listAdvertsPaginated(params);
  }

  async getAdvertStatistics(advertId: number, userId: string) {
    const advert = await advertRepo.getAdvertById(advertId);

    const user = await userRepo.getById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const premiumAccountType =
      await accountTypeRepo.getAccountTypeByName('premium');

    const isOwner = advert.userId === userId;
    const isPremiumAccount = user.accountTypeId === premiumAccountType.id;

    if (!isOwner) {
      throw new BadRequestError(
        'You can view statistics only for your own advertisements',
      );
    }

    if (!isPremiumAccount) {
      throw new BadRequestError(
        'Statistics are available only for premium accounts',
      );
    }

    const [viewsStats, avgPriceUah] = await Promise.all([
      advertViewStatsRepo.getViewsStats(advertId, new Date()),
      advertRepo.getRegionAveragePriceUah(advert.regionId),
    ]);

    return {
      ...viewsStats,
      averagePriceRegionUah: avgPriceUah,
    };
  }

  listAdvertsByUser(userId: string, params: AdvertListParams) {
    return advertRepo.listAdvertsByUserId(userId, params);
  }
}

export const advertService = new AdvertService();
