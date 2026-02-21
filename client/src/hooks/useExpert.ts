import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getExpertById } from '../api/experts';
import type { Expert } from '../types';

export const EXPERT_QUERY_KEY = (id: string) => ['expert', id];

export const useExpert = (id: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<Expert, Error>({
    queryKey: EXPERT_QUERY_KEY(id),
    queryFn: () => getExpertById(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });

  // updates the cached expert in-place when a socket event fires —
  // avoids a round-trip refetch for a single slot state change
  const markSlotBooked = useCallback(
    (date: string, timeSlot: string) => {
      queryClient.setQueryData<Expert>(EXPERT_QUERY_KEY(id), (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          availability: prev.availability?.map((avail) => {
            if (avail.date !== date) return avail;
            return {
              ...avail,
              slots: avail.slots.map((slot) =>
                slot.time === timeSlot ? { ...slot, isBooked: true } : slot
              ),
            };
          }),
        };
      });
    },
    [id, queryClient]
  );

  return { ...query, markSlotBooked };
};
