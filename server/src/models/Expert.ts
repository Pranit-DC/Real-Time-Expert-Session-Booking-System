import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeSlot {
  time: string;
  isBooked: boolean;
}

export interface IAvailability {
  date: string;
  slots: ITimeSlot[];
}

export interface IExpert extends Document {
  name: string;
  category: string;
  experience: number;
  rating: number;
  bio: string;
  avatar: string;
  availability: IAvailability[];
}

const timeSlotSchema = new Schema<ITimeSlot>({
  time: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

const availabilitySchema = new Schema<IAvailability>({
  date: { type: String, required: true },
  slots: [timeSlotSchema],
});

const expertSchema = new Schema<IExpert>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    experience: { type: Number, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    availability: [availabilitySchema],
  },
  { timestamps: true }
);

// Text index for name search
expertSchema.index({ name: 'text' });

export default mongoose.model<IExpert>('Expert', expertSchema);
