export interface TimeSlot {
  _id: string;
  time: string;
  isBooked: boolean;
}

export interface Availability {
  _id: string;
  date: string;
  slots: TimeSlot[];
}

export interface Expert {
  _id: string;
  name: string;
  category: string;
  experience: number;
  rating: number;
  bio: string;
  avatar: string;
  availability?: Availability[];
}

export interface ExpertsResponse {
  experts: Expert[];
  total: number;
  page: number;
  pages: number;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed';

export interface Booking {
  _id: string;
  expertId: Expert | string;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingPayload {
  expertId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  notes?: string;
}

export interface ApiError {
  message: string;
  errors?: { msg: string; path: string }[];
}
