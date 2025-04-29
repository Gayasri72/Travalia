import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema(
  {
    interests: {
      type: [String],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    numPeople: {
      type: Number,
      required: true,
    },
    startingPoint: String,
    totalDays: Number,
    totalDistance: Number,
    travelMode: String,
    totalFuelCost: Number,
    totalCost: Number,
    itinerary: [
      {
        day: Number,
        activities: [
          {
            name: String,
            location: {
              lat: Number,
              lng: Number,
            },
            region: String,
            category: String,
            activityType: String,
            rating: Number,
            tags: [String],
            avgTime: Number,
            avgTicketPrice: Number,
            replacedDueToRain: Boolean,
            originalActivity: String,
            indoorSuggestion: {
              name: String,
              location: {
                lat: Number,
                lng: Number,
              },
              region: String,
              category: String,
              activityType: String,
              rating: Number,
              tags: [String],
              avgTime: Number,
              avgTicketPrice: Number,
              suggestedDueToRain: Boolean,
            },
          },
        ],
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;
