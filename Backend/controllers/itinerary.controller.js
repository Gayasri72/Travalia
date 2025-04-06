
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

async function getDailyWeather(provinces, dates) {
  const API_KEY = process.env.WEATHER_API_KEY;
  const forecasts = [];

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const district = provinces[i % provinces.length];
    const cacheKey = `${district}-${date}`;

    // Check cache first
    if (weatherCache.has(cacheKey)) {
      forecasts.push(weatherCache.get(cacheKey));
      continue;
    }

    try {
      const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${district}&dt=${date}`;
      const response = await axios.get(url);
      
      const condition = response.data.forecast?.forecastday[0]?.day?.condition?.text || 'Cloudy';
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
      console.error(`Weather API error for ${district} on ${date}:`, error.message);
      forecasts.push({
        date,
        district,
        weather: 'Cloudy', // Default fallback
        day: i + 1
      });
    }
  }

  return forecasts;
}

function normalizeWeatherCondition(condition) {
  condition = condition.toLowerCase();
  if (condition.includes('rain')) return 'Rainy';
  if (condition.includes('sun') || condition.includes('clear')) return 'Sunny';
  if (condition.includes('cloud')) return 'Cloudy';
  if (condition.includes('wind')) return 'Windy';
  if (condition.includes('cool') || condition.includes('cold')) return 'Cool';
  return 'Cloudy'; // Default
}

export const createItinerary = async (req, res) => {
  try {
    const { provinces, startDate, endDate, members, budget, interests } = req.body;

    // Validate inputs
    if (!provinces || !provinces.length || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get dates and weather
    const dates = getDatesBetween(startDate, endDate);
    const daily_weather = await getDailyWeather(provinces, dates);

    // Generate itinerary
    const generatedPlan = await generateItinerary({
      provinces,
      startDate,
      endDate,
      members,
      budget,
      interests,
      daily_weather
    });

    // Save to database
    const newItinerary = new Itinerary({
      provinces,
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
      generatedPlan // Ensure this is included in response
    });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to generate itinerary. Please check your inputs and try again.'
    });
  }
};