import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Booking, { IBooking } from '../models/Booking';
import Expert from '../models/Expert';
import { getIO } from '../utils/socketManager';

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;
const EMAIL_REGEX     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /bookings
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ message: 'Validation failed', errors: errors.array() });
    return;
  }

  const { expertId, name, email, phone, date, timeSlot, notes } = req.body as {
    expertId: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    timeSlot: string;
    notes?: string;
  };

  // Validate ObjectId format before hitting MongoDB
  if (!OBJECT_ID_REGEX.test(expertId)) {
    res.status(400).json({ message: 'Invalid expert ID format' });
    return;
  }

  // transaction: slot lock + booking insert must be atomic
  // if booking insert fails, slot lock rolls back automatically
  // requires replica set (Atlas M0+ or local --replSet)
  const session = await mongoose.startSession();
  let booking: IBooking | null = null;

  try {
    await session.withTransaction(async () => {
      // Atomic slot lock inside transaction
      const updated = await Expert.findOneAndUpdate(
        {
          _id: expertId,
          'availability.date': date,
          'availability.slots': {
            $elemMatch: { time: timeSlot, isBooked: false },
          },
        },
        {
          $set: { 'availability.$[day].slots.$[slot].isBooked': true },
        },
        {
          arrayFilters: [
            { 'day.date': date },
            { 'slot.time': timeSlot, 'slot.isBooked': false },
          ],
          new: true,
          session,
        }
      );

      if (!updated) {
        // throwing inside withTransaction auto-aborts and rolls back
        throw Object.assign(new Error('SLOT_TAKEN'), { statusCode: 409 });
      }

      // runs in same transaction — commits together with the slot lock
      [booking] = await Booking.create(
        [{ expertId, name, email, phone, date, timeSlot, notes: notes ?? '' }],
        { session }
      );
    });

    // emit after commit only — no premature slot invalidation on failure
    getIO().emit('slot:booked', { expertId, date, timeSlot });

    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (err) {
    const e = err as Error & { code?: number; statusCode?: number };

    if (e.message === 'SLOT_TAKEN' || e.statusCode === 409) {
      res.status(409).json({ message: 'This slot is already booked. Please choose another.' });
      return;
    }
    // duplicate key — compound index fallback, shouldn't hit this with transactions
    if (e.code === 11000) {
      res.status(409).json({ message: 'This slot is already booked. Please choose another.' });
      return;
    }
    res.status(500).json({ message: 'Server error', error: e.message });
  } finally {
    session.endSession();
  }
};

// PATCH /bookings/:id/status
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  const bookingId = String(req.params.id);
  if (!OBJECT_ID_REGEX.test(bookingId)) {
    res.status(400).json({ message: 'Invalid booking ID format' });
    return;
  }

  const { status } = req.body as { status?: string };
  const allowed = ['Pending', 'Confirmed', 'Completed'];

  if (!status || !allowed.includes(status)) {
    res.status(400).json({
      message: `Invalid status. Must be one of: ${allowed.join(', ')}`,
    });
    return;
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    res.json({ message: 'Status updated', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

// GET /bookings?email=
export const getBookingsByEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.query as { email?: string };

  if (!email || !email.trim()) {
    res.status(400).json({ message: 'Email query parameter is required' });
    return;
  }

  // Validate email format — prevents garbage queries hitting the DB
  if (!EMAIL_REGEX.test(email.trim())) {
    res.status(400).json({ message: 'Invalid email format' });
    return;
  }

  try {
    const bookings = await Booking.find({ email: email.trim().toLowerCase() })
      .populate('expertId', 'name category avatar')
      .sort({ createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};
