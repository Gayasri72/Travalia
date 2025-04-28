import mongoose from 'mongoose';

const hireSchema = new mongoose.Schema({
  passengerName: {
    type: String,
    required: [true, 'Passenger name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required'],
  },
  pickupLocation: String,
  dropLocation: String,
  dateTime: {
    type: Date,
    required: [true, 'Date and Time are required'],
  },
  price: Number,
});

const Hire = mongoose.model('Hire', hireSchema);

export default Hire;
