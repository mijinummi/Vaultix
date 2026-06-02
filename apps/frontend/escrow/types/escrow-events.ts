export type EscrowEventType =
  | 'escrow:status_changed'
  | 'escrow:funded'
  | 'escrow:completed'
  | 'escrow:condition_fulfilled'
  | 'escrow:dispute_filed'
  | 'escrow:dispute_resolved';

  export interface EscrowRealtimeEvent {
  escrowId: string;

  type: EscrowEventType;

  timestamp: string;

  payload: Record<string, unknown>;
}
