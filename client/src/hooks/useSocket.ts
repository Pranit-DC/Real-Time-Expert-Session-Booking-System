import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface SlotBookedPayload {
  expertId: string;
  date: string;
  timeSlot: string;
}

interface UseSocketOptions {
  expertId: string;
  onSlotBooked: (payload: SlotBookedPayload) => void;
}

// Creates a single socket connection per mount, cleans up on unmount.
// Only processes events for the currently viewed expert.
export const useSocket = ({ expertId, onSlotBooked }: UseSocketOptions): void => {
  const socketRef = useRef<Socket | null>(null);
  // stable ref so the effect doesn't re-run when the callback changes
  const callbackRef = useRef(onSlotBooked);
  callbackRef.current = onSlotBooked;

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL as string, {
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('slot:booked', (payload: SlotBookedPayload) => {
      if (payload.expertId === expertId) {
        callbackRef.current(payload);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [expertId]);
};
