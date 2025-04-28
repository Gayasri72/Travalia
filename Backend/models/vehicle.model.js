import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vehicle name is required'],
  },
  passengers: {
    type: Number,
    required: [true, 'Number of passengers is required'],
  },
  baggage: {
    type: String,
    required: [true, 'Baggage info is required'],
  },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
