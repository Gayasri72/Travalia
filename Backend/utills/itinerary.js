
import axios from 'axios';
import { config } from 'dotenv';
config();

// Enhanced district database with reliable fallbacks
const DISTRICT_DATABASE = {
  Kandy: {
    Culture: ["Temple of the Sacred Tooth Relic", "Royal Botanical Gardens", "Kandy Lake"],
    Food: ["Theva Cuisine", "Balaji Dosai", "Kandy Muslim Hotel"],
    Nature: ["Udawattakele Sanctuary", "Hanthana Mountain Range"]
  },
  Trincomalee: {
    Beach: ["Nilaveli Beach", "Uppuveli Beach", "Marble Beach"],
    Culture: ["Koneswaram Temple", "Fort Frederick"],
    Food: ["Sri Lankan seafood at Pigeon Island", "Beachfront cafes"]
  }
};

async function fetchRealPlaces(district, interest) {
  try {
    // Try Google Places API first if key exists
    if (process.env.GOOGLE_PLACES_API_KEY) {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/textsearch/json',
        {
          params: {
            query: `${interest} in ${district}, Sri Lanka`,
            key: process.env.GOOGLE_PLACES_API_KEY,
            language: 'en'
          },
          timeout: 3000
        }
      );
      
      if (response.data.results?.length > 0) {
        return response.data.results.map(p => p.name);
      }
    }
    
    // Fallback to our local database
    if (DISTRICT_DATABASE[district]?.[interest]) {
      return DISTRICT_DATABASE[district][interest];
    }

    // Final fallback
    return [`Popular ${interest} location in ${district}`];
  } catch (error) {
    console.error(`Fetch error for ${district}/${interest}:`, error.message);
    return DISTRICT_DATABASE[district]?.[interest] || 
           [`${interest} experience in ${district}`];
  }
}

export default async function generateItinerary({ daily_weather, interests }) {
  const itinerary = [];

  for (const [index, day] of daily_weather.entries()) {
    const activities = [];
    
    // Get unique activities for top 3 interests
    for (const interest of [...new Set(interests)].slice(0, 3)) {
      const places = await fetchRealPlaces(day.district, interest);
      if (places.length) {
        activities.push(places[0]); // Take top result
      }
    }

    // Fill remaining slots with district highlights
    while (activities.length < 3) {
      activities.push(`Explore ${day.district}'s culture`);
    }

    itinerary.push({
      day: index + 1,
      district: day.district,
      weather: day.weather,
      activities: activities.slice(0, 3)
    });
  }

  return itinerary;
}