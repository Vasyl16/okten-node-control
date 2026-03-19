import * as advertRepo from '../db/repos/advert.repo';
import { NotFoundError } from '../errors/errors';

const MODERATION_STATUSES = ['needs_edit', 'under_review', 'inactive'] as const;
const CAN_APPROVE_STATUSES = ['needs_edit', 'under_review', 'inactive'] as const;
const CAN_REJECT_STATUSES = ['needs_edit', 'under_review'] as const;

class ModerationService {
  async listQueue() {
    return advertRepo.listAdvertsByStatuses([...MODERATION_STATUSES]);
  }

  async approve(advertId: number, comment?: string) {
    const advert = await advertRepo.getAdvertById(advertId);
    if (!CAN_APPROVE_STATUSES.includes(advert.status as (typeof CAN_APPROVE_STATUSES)[number])) {
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
    if (!CAN_REJECT_STATUSES.includes(advert.status as (typeof CAN_REJECT_STATUSES)[number])) {
      throw new NotFoundError('Advertisement not found or cannot be rejected');
    }
    return advertRepo.updateAdvertById(advertId, {
      status: 'inactive',
      moderationComment: comment ?? null,
      updatedAt: new Date(),
    });
  }
}

export const moderationService = new ModerationService();
