import mongoose, { Document, Schema, Types } from 'mongoose';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed';

export interface IBooking extends Document {
  expertId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  notes: string;
  status: BookingStatus;
}

const bookingSchema = new Schema<IBooking>(
  {
    expertId: {
      type: Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// Compound unique index — core double-booking prevention at DB level
bookingSchema.index(
  { expertId: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

// Single-field index on email — makes GET /bookings?email= O(log n) not O(n)
bookingSchema.index({ email: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
