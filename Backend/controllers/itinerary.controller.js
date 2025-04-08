
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

import Itinerary from '../models/itinerary.model.js';
import generateItinerary from '../utills/itinerary.js';
import moment from 'moment';
import axios from 'axios';
import { config } from 'dotenv';
config();

// Get dates between start and end
function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = moment(startDate);
  const endDateMoment = moment(endDate);

  while (currentDate.isSameOrBefore(endDateMoment)) {
    dates.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'days');
  }

  return dates;
}

// Enhanced weather fetching with caching
const weatherCache = new Map();

async function getDailyWeather(districts, dates) {
  console.log('getDailyWeather() called with:', districts, dates);

  const API_KEY = process.env.WEATHER_API_KEY;
  console.log('Using WEATHER_API_KEY:', API_KEY?.slice(0, 5) + '...');

  const forecasts = [];

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const district = districts[i % districts.length];
    const cacheKey = `${district}-${date}`;

    // Check cache first
    if (weatherCache.has(cacheKey)) {
      console.log(`Using cached weather for ${district} on ${date}`);
      forecasts.push(weatherCache.get(cacheKey));
      continue;
    }

    // Check if date is within 14 days (WeatherAPI free tier limit)
    if (moment(date).diff(moment(), 'days') > 14) {
      console.warn(`Skipping weather fetch for ${district} on ${date} (outside 14-day forecast limit).`);
      forecasts.push({
        date,
        district,
        weather: 'Cloudy', // fallback
        day: i + 1
      });
      continue;
    }

    try {
      const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${district}&dt=${date}`;
      console.log('Weather API request URL:', url);

      const response = await axios.get(url);
      const condition = response.data.forecast?.forecastday[0]?.day?.condition?.text || 'Cloudy';

      console.log(`Raw weather condition for ${district} on ${date}:`, condition);

      const weather = normalizeWeatherCondition(condition);

      const forecast = {
        date,
        district,
        weather,
        day: i + 1
      };

      weatherCache.set(cacheKey, forecast);
      forecasts.push(forecast);
    } catch (error) {
      console.error(`Weather API error for ${district} on ${date}:`, error?.response?.data || error.message);
      forecasts.push({
        date,
        district,
        weather: 'Cloudy',
        day: i + 1
      });
    }
  }

  return forecasts;
}

function normalizeWeatherCondition(condition) {
  condition = condition.toLowerCase();

  if (condition.includes('thunder')) return 'Stormy';
  if (condition.includes('snow')) return 'Snowy';
  if (condition.includes('rain') || condition.includes('shower') || condition.includes('drizzle') || condition.includes('patchy rain')) return 'Rainy';
  if (condition.includes('sunny') || condition.includes('clear')) return 'Sunny';
  if (condition.includes('partly cloudy') || condition.includes('cloud')) return 'Cloudy';
  if (condition.includes('wind')) return 'Windy';
  if (condition.includes('cool') || condition.includes('cold')) return 'Cool';

  return 'Cloudy'; // Default fallback
}

// Get distance between two places
async function getDistanceBetween(origin, destination) {
  const API_KEY = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === 'OK' && response.data.rows?.[0]?.elements?.[0]) {
      const distance = response.data.rows[0].elements[0].distance.text;
      return distance;
    } else {
      console.error('Invalid response from Distance API:', response.data);
      return 'Unknown distance';
    }
  } catch (error) {
    console.error('Distance API error for', origin, 'to', destination, ':', error.message);
    return 'Error calculating distance';
  }
}

// Create itinerary
export const createItinerary = async (req, res) => {
  try {
    const { districts, startDate, endDate, members, budget, interests } = req.body;

    console.log('Received request to create itinerary with:', req.body);

    if (!districts || !districts.length || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dates = getDatesBetween(startDate, endDate);
    console.log('Generated dates:', dates);

    const daily_weather = await getDailyWeather(districts, dates);
    console.log('Fetched daily weather:', daily_weather);

    const generatedPlan = await generateItinerary({
      districts,
      startDate,
      endDate,
      members,
      budget,
      interests,
      daily_weather
    });

    console.log('Generated itinerary plan:', generatedPlan);

    const newItinerary = new Itinerary({
      districts,
      startDate,
      endDate,
      members,
      budget,
      interests,
      daily_weather,
      trip_plan: generatedPlan
    });

    await newItinerary.save();

    res.status(201).json({
      ...newItinerary.toObject(),
      generatedPlan
    });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    res.status(500).json({
      error: error.message,
      details: 'Failed to generate itinerary. Please check your inputs and try again.'
    });
  }
};

