import mongoose from 'mongoose';

// Define schema for your trip data
const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  region: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, required: true },
  tags: [String],
  avgTime: { type: Number, required: true },
  avgTicketPrice: { type: Number, required: true }
});

// Create a model from the schema
const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
