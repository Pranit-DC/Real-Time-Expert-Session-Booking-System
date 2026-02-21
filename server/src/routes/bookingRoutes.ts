import { Router } from 'express';
import { body } from 'express-validator';
import {
  createBooking,
  updateBookingStatus,
  getBookingsByEmail,
} from '../controllers/bookingController';

const router = Router();

const bookingValidation = [
  body('expertId').notEmpty().withMessage('Expert ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone')
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage('Valid phone number is required'),
  body('date')
    .notEmpty()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
];

router.get('/', getBookingsByEmail);
router.post('/', bookingValidation, createBooking);
router.patch('/:id/status', updateBookingStatus);

export default router;
