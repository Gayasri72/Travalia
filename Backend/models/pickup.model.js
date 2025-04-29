import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  contact: {
    type: String,
    required: [true, 'Contact is required'],
  },
  flightNumber: {
    type: String,
    required: [true, 'Flight number is required'],
  },
  pickupTime: {
    type: Date,
    required: [true, 'Pickup time is required'],
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
  },
});

const Pickup = mongoose.model('Pickup', pickupSchema);

export default Pickup;