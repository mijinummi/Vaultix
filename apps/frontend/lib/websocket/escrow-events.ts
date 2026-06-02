import { socket } from './client';

export function joinEscrowRoom(
  escrowId: string,
) {
  socket.emit(
    'join',
    `escrow:${escrowId}`,
  );
}

export function leaveEscrowRoom(
  escrowId: string,
) {
  socket.emit(
    'leave',
    `escrow:${escrowId}`,
  );
}

export function subscribeToEscrowEvents(
  callback: (
    event: EscrowRealtimeEvent,
  ) => void,
) {
  const handlers = [
    'escrow:status_changed',
    'escrow:funded',
    'escrow:completed',
    'escrow:condition_fulfilled',
    'escrow:dispute_filed',
    'escrow:dispute_resolved',
  ];

  handlers.forEach(event =>
    socket.on(event, callback),
  );

  return () => {
    handlers.forEach(event =>
      socket.off(event, callback),
    );
  };
}

export function LiveIndicator({
  connected,
}: Props) {
  return (
    <div
      className="
      flex items-center gap-2
      text-sm
    "
    >
      <span
        className={
          connected
            ? 'bg-green-500'
            : 'bg-yellow-500'
        }
      />

      {connected
        ? 'Live'
        : 'Reconnecting'}
    </div>
  );
}