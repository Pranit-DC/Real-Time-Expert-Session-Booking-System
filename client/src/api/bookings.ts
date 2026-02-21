import apiClient from './client';
import type { Booking, BookingPayload, BookingStatus } from '../types';

export const createBooking = async (payload: BookingPayload): Promise<Booking> => {
  const { data } = await apiClient.post<{ booking: Booking }>('/bookings', payload);
  return data.booking;
};

export const getBookingsByEmail = async (email: string): Promise<Booking[]> => {
  const { data } = await apiClient.get<Booking[]>('/bookings', { params: { email } });
  return data;
};

export const updateBookingStatus = async (id: string, status: BookingStatus): Promise<Booking> => {
  const { data } = await apiClient.patch<{ booking: Booking }>(`/bookings/${id}/status`, { status });
  return data.booking;
};
