import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    stripeSessionId: {
      type: String,
    },
    stripePaymentIntentId: {
      type: String,
    },
    status: {
      type: String,
      default: 'Paid',
    },
    notification: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
