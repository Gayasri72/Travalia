import mongoose from 'mongoose';

const hireSchema = new mongoose.Schema(
  {
    pickUpLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    dropLocation: {
      type: String,
      required: [true, 'Drop location is required'],
      trim: true,
    },
    dateTime: {
      type: Date,
      required: [true, 'Date and time are required'],
    },
    userDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
  },
  { timestamps: true }
);

const Hire = mongoose.model('Hire', hireSchema);

export default Hire;
