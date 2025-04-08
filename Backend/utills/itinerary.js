
// import axios from 'axios';
// import { config } from 'dotenv';
// config();

// // Enhanced district database with reliable fallbacks
// const DISTRICT_DATABASE = {
//   Kandy: {
//     Culture: ["Temple of the Sacred Tooth Relic", "Royal Botanical Gardens", "Kandy Lake"],
//     Food: ["Theva Cuisine", "Balaji Dosai", "Kandy Muslim Hotel"],
//     Nature: ["Udawattakele Sanctuary", "Hanthana Mountain Range"]
//   },
//   Trincomalee: {
//     Beach: ["Nilaveli Beach", "Uppuveli Beach", "Marble Beach"],
//     Culture: ["Koneswaram Temple", "Fort Frederick"],
//     Food: ["Sri Lankan seafood at Pigeon Island", "Beachfront cafes"]
//   }
// };

// async function fetchRealPlaces(district, interest) {
//   try {
//     // Try Google Places API first if key exists
//     if (process.env.GOOGLE_PLACES_API_KEY) {
//       const response = await axios.get(
//         'https://maps.googleapis.com/maps/api/place/textsearch/json',
//         {
//           params: {
//             query: `${interest} in ${district}, Sri Lanka`,
//             key: process.env.GOOGLE_PLACES_API_KEY,
//             language: 'en'
//           },
//           timeout: 3000
//         }
//       );
      
//       if (response.data.results?.length > 0) {
//         return response.data.results.map(p => p.name);
//       }
//     }
    
//     // Fallback to our local database
//     if (DISTRICT_DATABASE[district]?.[interest]) {
//       return DISTRICT_DATABASE[district][interest];
//     }

//     // Final fallback
//     return [`Popular ${interest} location in ${district}`];
//   } catch (error) {
//     console.error(`Fetch error for ${district}/${interest}:`, error.message);
//     return DISTRICT_DATABASE[district]?.[interest] || 
//            [`${interest} experience in ${district}`];
//   }
// }

// export default async function generateItinerary({ daily_weather, interests }) {
//   const itinerary = [];

//   for (const [index, day] of daily_weather.entries()) {
//     const activities = [];
    
//     // Get unique activities for top 3 interests
//     for (const interest of [...new Set(interests)].slice(0, 3)) {
//       const places = await fetchRealPlaces(day.district, interest);
//       if (places.length) {
//         activities.push(places[0]); // Take top result
//       }
//     }

//     // Fill remaining slots with district highlights
//     while (activities.length < 3) {
//       activities.push(`Explore ${day.district}'s culture`);
//     }

//     itinerary.push({
//       day: index + 1,
//       district: day.district,
//       weather: day.weather,
//       activities: activities.slice(0, 3)
//     });
//   }

//   return itinerary;
// }

//......................................................................

//axios used for fetching data from Google Places API
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

// Function to get distance between two locations using Google Distance Matrix API
async function getDistanceBetween(origin, destination) {
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
    const response = await axios.get(url, {
      params: {
        origins: origin,
        destinations: destination,
        key: process.env.GOOGLE_PLACES_API_KEY
      }
    });

    //console.log(`Distance API response for ${origin} to ${destination}:`, response.data); // Log API response

    const distance = response.data?.rows?.[0]?.elements?.[0]?.distance?.text;
    const duration = response.data?.rows?.[0]?.elements?.[0]?.duration?.text;

    if (distance && duration) {
      return { distance, duration };
    }

    throw new Error('Distance or duration data not found');
  } catch (error) {
    console.error(`Distance API error for ${origin} to ${destination}:`, error.message);
    return { distance: 'Unknown', duration: 'Unknown' };
  }
}

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
      
      //console.log(`Google Places API response for ${interest} in ${district}:`, response.data); // Log API response
     // console.log(response.data.length);

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

export default async function generateItinerary({ daily_weather, interests, budget, district}) {
  const itinerary = [];
  let remainingBudget = budget;

  for (const [index, day] of daily_weather.entries()) {
    const activities = [];
    const district = day.district;
    
    // Get unique activities for top 3 interests
    for (const interest of [...new Set(interests)].slice(0, 3)) {
      const places = await fetchRealPlaces(district, interest);
      if (places.length) {
        activities.push(places[0]); // Take top result
      }
    }

    // Check distance and add to the plan
    if (index < daily_weather.length - 1) {
      const nextDistrict = daily_weather[index + 1].district;
      const distance = await getDistanceBetween(district, nextDistrict);
      activities.push(`Distance to next location: ${distance}`);
    }

    // Add budget consideration (simplified for now, you can refine this based on activity costs)
    if (remainingBudget > 0) {
      activities.push(`Remaining Budget: $${remainingBudget}`);
      remainingBudget -= 20; // Example of spending some budget for each activity, you can make this dynamic
    }

    // Fill remaining slots with district highlights
    while (activities.length < 3) {
      activities.push(`Explore ${district}'s culture`);
    }

    itinerary.push({
      day: index + 1,
      district: district,
      weather: day.weather,
      activities: activities.slice(0, 3)
    });
  }

  return itinerary;
}


