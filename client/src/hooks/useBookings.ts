import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookingsByEmail, createBooking, updateBookingStatus } from '../api/bookings';
import type { BookingPayload, BookingStatus } from '../types';

export const bookingKeys = {
  byEmail: (email: string) => ['bookings', 'email', email] as const,
};

export const useBookingsByEmail = (email: string) => {
  return useQuery({
    queryKey: bookingKeys.byEmail(email),
    queryFn: () => getBookingsByEmail(email),
    enabled: Boolean(email),
    staleTime: 30_000,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BookingPayload) => createBooking(payload),
    onSuccess: (newBooking) => {
      // invalidate the email's booking list so it refetches on next view
      queryClient.invalidateQueries({
        queryKey: bookingKeys.byEmail(newBooking.email),
      });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      updateBookingStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.byEmail(updated.email),
      });
    },
  });
};
