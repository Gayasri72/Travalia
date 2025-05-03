import mongoose from 'mongoose';

const dropSchema = new mongoose.Schema({
  pickupLocation: {
    type: String,
    required: true
  },
  dropLocation: {
    type: String,
    required: true,
    default: 'BIA Arrival Terminal, Katunayake, Sri Lanka'
  },
  date: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Drop', dropSchema); 