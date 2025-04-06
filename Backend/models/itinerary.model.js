import mongoose from 'mongoose';

const ItinerarySchema = new mongoose.Schema(
  {
    provinces: [String], // List of provinces to visit
    startDate: String, // Start date of the trip
    endDate: String, // End date of the trip
    days: Number, // Number of days for the trip
    members: Number, // Number of people on the trip
    budget: Number, // Budget for the trip
    interests: [String], // List of interests (e.g., Adventure, Culture)
    distance_km: Number, // Distance to be traveled (in kilometers)
    daily_weather: [
      {
        date: String, // Date of the trip
        district: String, // District for the day
        weather: String, // Weather for that day (e.g., Sunny, Rainy, Cloudy)
      },
    ], // Daily weather conditions
    generatedPlan: [
      {
        day: Number, // Day number
        date: String, // Date of the trip
        district: String, // District for the day
        weather: String, // Weather for the day
        activities: [String], // List of activities for the day
      },
    ], // Generated itinerary plan
  },
  { timestamps: true }, // Automatically includes createdAt and updatedAt fields
);

export default mongoose.model('Itinerary', ItinerarySchema);
