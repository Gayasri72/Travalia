
// import Itinerary from '../models/itinerary.model.js';
// import generateItinerary from '../utills/itinerary.js';
// import moment from 'moment';
// import axios from 'axios';
// import { config } from 'dotenv';
// config();

// // Get dates between start and end
// function getDatesBetween(startDate, endDate) {
//   const dates = [];
//   let currentDate = moment(startDate);
//   const endDateMoment = moment(endDate);

//   while (currentDate.isSameOrBefore(endDateMoment)) {
//     dates.push(currentDate.format('YYYY-MM-DD'));
//     currentDate = currentDate.add(1, 'days');
//   }

//   return dates;
// }

// // Enhanced weather fetching with caching
// const weatherCache = new Map();

// async function getDailyWeather(provinces, dates) {
//   const API_KEY = process.env.WEATHER_API_KEY;
//   const forecasts = [];

//   for (let i = 0; i < dates.length; i++) {
//     const date = dates[i];
//     const district = provinces[i % provinces.length];
//     const cacheKey = `${district}-${date}`;

//     // Check cache first
//     if (weatherCache.has(cacheKey)) {
//       forecasts.push(weatherCache.get(cacheKey));
//       continue;
//     }

//     try {
//       const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${district}&dt=${date}`;
//       const response = await axios.get(url);
      
//       const condition = response.data.forecast?.forecastday[0]?.day?.condition?.text || 'Cloudy';
//       const weather = normalizeWeatherCondition(condition);

//       const forecast = {
//         date,
//         district,
//         weather,
//         day: i + 1
//       };

//       weatherCache.set(cacheKey, forecast);
//       forecasts.push(forecast);
//     } catch (error) {
//       console.error(`Weather API error for ${district} on ${date}:`, error.message);
//       forecasts.push({
//         date,
//         district,
//         weather: 'Cloudy', // Default fallback
//         day: i + 1
//       });
//     }
//   }

//   return forecasts;
// }

// function normalizeWeatherCondition(condition) {
//   condition = condition.toLowerCase();
//   if (condition.includes('rain')) return 'Rainy';
//   if (condition.includes('sun') || condition.includes('clear')) return 'Sunny';
//   if (condition.includes('cloud')) return 'Cloudy';
//   if (condition.includes('wind')) return 'Windy';
//   if (condition.includes('cool') || condition.includes('cold')) return 'Cool';
//   return 'Cloudy'; // Default
// }

// export const createItinerary = async (req, res) => {
//   try {
//     const { provinces, startDate, endDate, members, budget, interests } = req.body;

//     // Validate inputs
//     if (!provinces || !provinces.length || !startDate || !endDate) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Get dates and weather
//     const dates = getDatesBetween(startDate, endDate);
//     const daily_weather = await getDailyWeather(provinces, dates);

//     // Generate itinerary
//     const generatedPlan = await generateItinerary({
//       provinces,
//       startDate,
//       endDate,
//       members,
//       budget,
//       interests,
//       daily_weather
//     });

//     // Save to database
//     const newItinerary = new Itinerary({
//       provinces,
//       startDate,
//       endDate,
//       members,
//       budget,
//       interests,
//       daily_weather,
//       trip_plan: generatedPlan
//     });

//     await newItinerary.save();

//     res.status(201).json({
//       ...newItinerary.toObject(),
//       generatedPlan // Ensure this is included in response
//     });
//   } catch (error) {
//     console.error('Error creating itinerary:', error);
//     res.status(500).json({ 
//       error: error.message,
//       details: 'Failed to generate itinerary. Please check your inputs and try again.'
//     });
//   }
// };

//.......................................................................................................

// import Itinerary from '../models/itinerary.model.js';
// import generateItinerary from '../utills/itinerary.js';
// import moment from 'moment';
// import axios from 'axios';
// import { config } from 'dotenv';
// config();

// // Get dates between start and end
// function getDatesBetween(startDate, endDate) {
//   const dates = [];
//   let currentDate = moment(startDate);
//   const endDateMoment = moment(endDate);

//   while (currentDate.isSameOrBefore(endDateMoment)) {
//     dates.push(currentDate.format('YYYY-MM-DD'));
//     currentDate = currentDate.add(1, 'days');
//   }

//   return dates;
// }

// // Enhanced weather fetching with caching
// const weatherCache = new Map();

// async function getDailyWeather(districts, dates) {
//   console.log('getDailyWeather() called with:', districts, dates);

//   const API_KEY = process.env.WEATHER_API_KEY;
//   console.log('Using WEATHER_API_KEY:', API_KEY?.slice(0, 5) + '...');

//   const forecasts = [];

//   for (let i = 0; i < dates.length; i++) {
//     const date = dates[i];
//     const district = districts[i % districts.length];
//     const cacheKey = `${district}-${date}`;

//     // Check cache first
//     if (weatherCache.has(cacheKey)) {
//       console.log(`Using cached weather for ${district} on ${date}`);
//       forecasts.push(weatherCache.get(cacheKey));
//       continue;
//     }

//     // Check if date is within 14 days (WeatherAPI free tier limit)
//     if (moment(date).diff(moment(), 'days') > 14) {
//       console.warn(`Skipping weather fetch for ${district} on ${date} (outside 14-day forecast limit).`);
//       forecasts.push({
//         date,
//         district,
//         weather: 'Cloudy', // fallback
//         day: i + 1
//       });
//       continue;
//     }

//     try {
//       const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${district}&dt=${date}`;
//       console.log('Weather API request URL:', url);

//       const response = await axios.get(url);
//       const condition = response.data.forecast?.forecastday[0]?.day?.condition?.text || 'Cloudy';

//       console.log(`Raw weather condition for ${district} on ${date}:`, condition);

//       const weather = normalizeWeatherCondition(condition);

//       const forecast = {
//         date,
//         district,
//         weather,
//         day: i + 1
//       };

//       weatherCache.set(cacheKey, forecast);
//       forecasts.push(forecast);
//     } catch (error) {
//       console.error(`Weather API error for ${district} on ${date}:`, error?.response?.data || error.message);
//       forecasts.push({
//         date,
//         district,
//         weather: 'Cloudy',
//         day: i + 1
//       });
//     }
//   }

//   return forecasts;
// }

// function normalizeWeatherCondition(condition) {
//   condition = condition.toLowerCase();

//   if (condition.includes('thunder')) return 'Stormy';
//   if (condition.includes('snow')) return 'Snowy';
//   if (condition.includes('rain') || condition.includes('shower') || condition.includes('drizzle') || condition.includes('patchy rain')) return 'Rainy';
//   if (condition.includes('sunny') || condition.includes('clear')) return 'Sunny';
//   if (condition.includes('partly cloudy') || condition.includes('cloud')) return 'Cloudy';
//   if (condition.includes('wind')) return 'Windy';
//   if (condition.includes('cool') || condition.includes('cold')) return 'Cool';

//   return 'Cloudy'; // Default fallback
// }

// // Get distance between two places
// async function getDistanceBetween(origin, destination) {
//   const API_KEY = process.env.GOOGLE_API_KEY;
//   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${API_KEY}`;

//   try {
//     const response = await axios.get(url);
//     if (response.data.status === 'OK' && response.data.rows?.[0]?.elements?.[0]) {
//       const distance = response.data.rows[0].elements[0].distance.text;
//       return distance;
//     } else {
//       console.error('Invalid response from Distance API:', response.data);
//       return 'Unknown distance';
//     }
//   } catch (error) {
//     console.error('Distance API error for', origin, 'to', destination, ':', error.message);
//     return 'Error calculating distance';
//   }
// }

// // Create itinerary
// export const createItinerary = async (req, res) => {
//   try {
//     const { districts, startDate, endDate, members, budget, interests } = req.body;

//     console.log('Received request to create itinerary with:', req.body);

//     if (!districts || !districts.length || !startDate || !endDate) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const dates = getDatesBetween(startDate, endDate);
//     console.log('Generated dates:', dates);

//     const daily_weather = await getDailyWeather(districts, dates);
//     console.log('Fetched daily weather:', daily_weather);

//     const generatedPlan = await generateItinerary({
//       districts,
//       startDate,
//       endDate,
//       members,
//       budget,
//       interests,
//       daily_weather
//     });

//     console.log('Generated itinerary plan:', generatedPlan);

//     const newItinerary = new Itinerary({
//       districts,
//       startDate,
//       endDate,
//       members,
//       budget,
//       interests,
//       daily_weather,
//       trip_plan: generatedPlan
//     });

//     await newItinerary.save();

//     res.status(201).json({
//       ...newItinerary.toObject(),
//       generatedPlan
//     });
//   } catch (error) {
//     console.error('Error creating itinerary:', error);
//     res.status(500).json({
//       error: error.message,
//       details: 'Failed to generate itinerary. Please check your inputs and try again.'
//     });
//   }
// };

//.............................................................................................................................................................................................................


import places from '../dev-data/data/trip.json' assert { type: 'json' };

// Helper: Haversine formula to get distance between two coordinates (in km)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => value * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Helper: Fetch weather info for a given location
const getWeather = async (lat, lon, date) => {
  const apiKey = '68af94336fbb4cf7bcc181546250404'; // Replace with your WeatherAPI key
  const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${lat},${lon}&dt=${date}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.forecast.forecastday[0].day; // Return the day's weather data
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

// Helper: Check if the weather has high rain probability (over 50%)
const hasHeavyRain = (weather) => {
  return weather && weather.daily_will_it_rain > 50;
  
};


// Helper: Find the nearest indoor place
const findNearestIndoorPlace = (currentPlace, allPlaces) => {
  const indoorPlaces = allPlaces.filter(place => place.activityType === 'indoor');
  
  let nearest = null;
  let minDist = Infinity;

  indoorPlaces.forEach(place => {
    const dist = getDistance(currentPlace.location.lat, currentPlace.location.lng, place.location.lat, place.location.lng);
    if (dist < minDist) {
      nearest = place;
      minDist = dist;
    }
  });

  return nearest;
};

// Helper: Calculate route distance starting from a place using nearest-neighbor
const calculateRouteDistance = (startPlace, allPlaces) => {
  const visited = new Set();
  let current = startPlace;
  let totalDistance = 0;
  visited.add(current.name);

  while (visited.size < allPlaces.length) {
    let nearest = null;
    let minDist = Infinity;

    for (const place of allPlaces) {
      if (visited.has(place.name)) continue;
      const dist = getDistance(current.location.lat, current.location.lng, place.location.lat, place.location.lng);
      if (dist < minDist) {
        nearest = place;
        minDist = dist;
      }
    }

    if (nearest) {
      totalDistance += minDist;
      visited.add(nearest.name);
      current = nearest;
    }
  }

  return totalDistance;
};

// Helper: Calculate the number of days between start and end dates
const calculateDaysBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = Math.abs(end - start);
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
  return dayDiff;
};

// Main itinerary generator function
const generateItinerary = async (req, res) => {
  const { interests, startDate, endDate } = req.body;

  if (!interests || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required fields: interests, startDate, endDate" });
  }

  // Step 1: Calculate the number of days for the trip
  const days = calculateDaysBetweenDates(startDate, endDate);
  console.log(`Trip duration: ${days} days`);

  // Step 2: Filter all matching places based on interests
  const matchedPlaces = places
    .filter(p =>
      interests.includes(p.category) || p.tags.some(tag => interests.includes(tag))
    )
    .sort((a, b) => b.rating - a.rating);

  if (matchedPlaces.length === 0) {
    return res.status(404).json({ error: "No places matched your interests." });
  }

  // Step 3: Count regions and find the most common one
  const regionCount = {};
  matchedPlaces.forEach(p => {
    regionCount[p.region] = (regionCount[p.region] || 0) + 1;
  });
  const mostCommonRegion = Object.entries(regionCount).sort((a, b) => b[1] - a[1])[0][0];

  // Step 4: Get all places in that region
  const regionPlaces = matchedPlaces.filter(p => p.region === mostCommonRegion);

  // Step 5: Find best starting point in that region (shortest route)
  let bestStart = regionPlaces[0];
  let shortestRoute = Infinity;
  for (const candidate of regionPlaces) {
    const routeLength = calculateRouteDistance(candidate, regionPlaces);
    if (routeLength < shortestRoute) {
      bestStart = candidate;
      shortestRoute = routeLength;
    }
  }

  const startingPlace = bestStart;

  // Step 6: Sort remaining places using nearest-neighbor from starting point
  const visited = new Set();
  let current = startingPlace;
  const orderedPlaces = [startingPlace];
  visited.add(current.name);

  while (visited.size < regionPlaces.length) {
    let nearest = null;
    let minDist = Infinity;

    for (const place of regionPlaces) {
      if (visited.has(place.name)) continue;
      const dist = getDistance(current.location.lat, current.location.lng, place.location.lat, place.location.lng);
      if (dist < minDist) {
        nearest = place;
        minDist = dist;
      }
    }

    if (nearest) {
      orderedPlaces.push(nearest);
      visited.add(nearest.name);
      current = nearest;
    }
  }

  // Step 7: Check weather for each place and suggest indoor options if needed
  const itinerary = [];
  let currentDay = 1;
  let timeLeft = 8; // hours per day
  let dayPlan = [];

  for (const place of orderedPlaces) {
    const weather = await getWeather(place.location.lat, place.location.lng, startDate); // Check weather for the start date

    if (hasHeavyRain(weather)) {
      const indoorPlace = findNearestIndoorPlace(place, regionPlaces);
      if (indoorPlace) {
        dayPlan.push(indoorPlace); // Add nearest indoor place to the day plan
        timeLeft -= indoorPlace.avgTime;
      } else {
        dayPlan.push(place);
        timeLeft -= place.avgTime;
      }
    } else {
      dayPlan.push(place);
      timeLeft -= place.avgTime;
    }

    if (timeLeft <= 0 || dayPlan.length >= days) {
      itinerary.push({ day: currentDay, activities: dayPlan });
      currentDay++;
      timeLeft = 8; // Reset for the next day
      dayPlan = [];
    }
  }

  // Step 8: Calculate total estimated cost
  const totalCost = itinerary
    .flatMap(d => d.activities)
    .reduce((sum, place) => sum + place.avgTicketPrice, 0);

  res.json({
    startingPoint: startingPlace.name,
    totalDays: days,
    itinerary,
    totalCost
  });
};

export { generateItinerary };
