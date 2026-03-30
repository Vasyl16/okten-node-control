import * as advertRepo from '../db/repos/advert.repo';
import * as userRepo from '../db/repos/user.repo';
import { NotFoundError } from '../errors/errors';

import { emailService } from './email.service';

const MODERATION_STATUSES = ['needs_edit', 'under_review', 'inactive'] as const;
const CAN_APPROVE_STATUSES = [
  'needs_edit',
  'under_review',
  'inactive',
] as const;
const CAN_REJECT_STATUSES = ['needs_edit', 'under_review'] as const;

class ModerationService {
  private async notifyOwnerOnReject(
    ownerUserId: string,
    advertId: number,
    comment?: string,
  ): Promise<void> {
    const owner = await userRepo.getById(ownerUserId);
    if (!owner?.email) {
      return;
    }

    const subject = `Your advertisement #${advertId} was rejected`;
    const reason = comment?.trim() || 'No additional comment provided';
    const text = `Your advertisement #${advertId} was rejected by moderation. Reason: ${reason}`;
    const html = `
      <p>Your advertisement <b>#${advertId}</b> was rejected by moderation.</p>
      <p><b>Reason:</b> ${reason}</p>
    `;

    await emailService.sendEmail(owner.email, subject, html, text);
  }

  async listQueue() {
    return advertRepo.listAdvertsByStatuses([...MODERATION_STATUSES]);
  }

  async approve(advertId: number, comment?: string) {
    const advert = await advertRepo.getAdvertById(advertId);
    if (
      !CAN_APPROVE_STATUSES.includes(
        advert.status as (typeof CAN_APPROVE_STATUSES)[number],
      )
    ) {
      throw new NotFoundError('Advertisement not found or cannot be approved');
    }
    return advertRepo.updateAdvertById(advertId, {
      status: 'active',
      editAttempts: 0,
      moderationComment: comment ?? null,
      updatedAt: new Date(),
    });
  }

  async reject(advertId: number, comment?: string) {
    const advert = await advertRepo.getAdvertById(advertId);
    if (
      !CAN_REJECT_STATUSES.includes(
        advert.status as (typeof CAN_REJECT_STATUSES)[number],
      )
    ) {
      throw new NotFoundError('Advertisement not found or cannot be rejected');
    }
    const updated = await advertRepo.updateAdvertById(advertId, {
      status: 'inactive',
      moderationComment: comment ?? null,
      updatedAt: new Date(),
    });

    // Notification should not break moderation flow.
    this.notifyOwnerOnReject(advert.userId, advertId, comment).catch(
      (error) => {
        console.error(
          `Failed to send reject email for advert #${advertId} to owner ${advert.userId}`,
          error,
        );
      },
    );

    return updated;
  }
}

export const moderationService = new ModerationService();
