import { Injectable, Logger } from '@nestjs/common';
import { EscrowGateway } from './escrow.gateway';

export type EscrowLifecycleEventType =
  | 'escrow.created'
  | 'escrow.funded'
  | 'escrow.milestone.updated'
  | 'escrow.milestone.approved'
  | 'escrow.condition.fulfilled'
  | 'escrow.disputed'
  | 'escrow.dispute.resolved'
  | 'escrow.refunded'
  | 'escrow.cancelled'
  | 'escrow.completed';

interface BroadcastPayload {
  escrowId: string;
  eventType: EscrowLifecycleEventType;
  actor: string;
  data: Record<string, any>;
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly escrowGateway: EscrowGateway) {}

  /**
   * Dispatches lifecycle event broadcasts safely decoupled from direct controller handlers
   */
  broadcastEscrowEvent(payload: BroadcastPayload) {
    const envelope = {
      ...payload,
      timestamp: new Date().toISOString(),
    };

    const roomTarget = `escrow:${payload.escrowId}`;
    this.logger.log(`Broadcasting event [${payload.eventType}] down room tracks: ${roomTarget}`);

    // Multicast across targeting stream pools concurrently
    this.escrowGateway.server.to(roomTarget).emit('escrow.update', envelope);
    this.escrowGateway.server.to('admin').emit('admin.escrow.audit', envelope);
  }

  /**
   * Directly target explicit specific users for platform notifications
   */
  sendNewNotification(userId: string, notificationData: Record<string, any>) {
    const envelope = {
      eventType: 'notification.new',
      timestamp: new Date().toISOString(),
      data: notificationData,
    };

    this.escrowGateway.server.to(`user:${userId}`).emit('notification.new', envelope);
  }
}