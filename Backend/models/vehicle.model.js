import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A vehicle must have a name'],
  },
  passengers: {
    type: Number,
    required: [true, 'A vehicle must have a passenger capacity'],
  },
  baggage: {
    type: String,
    required: [true, 'A vehicle must have a baggage capacity'],
  },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;