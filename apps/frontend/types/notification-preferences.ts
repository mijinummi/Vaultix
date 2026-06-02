export enum NotificationEventType {
  ESCROW_CREATED = 'ESCROW_CREATED',
  ESCROW_FUNDED = 'ESCROW_FUNDED',
  MILESTONE_RELEASED = 'MILESTONE_RELEASED',
  ESCROW_COMPLETED = 'ESCROW_COMPLETED',
  DISPUTE_CREATED = 'DISPUTE_CREATED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
}

export interface NotificationPreference {
  eventType: NotificationEventType;

  emailEnabled: boolean;

  webhookEnabled: boolean;
}