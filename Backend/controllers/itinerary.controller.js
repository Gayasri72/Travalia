

import Itinerary from '../models/itinerary.model.js';
import Trip from '../models/trip.model.js';

// Helper: Haversine formula to get distance between two coordinates (in km)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Helper: Fetch weather info for a given location
const getWeather = async (lat, lon, date) => {
  // Simulate weather: generate a random number between 1 and 100
  const rainProbability = Math.floor(Math.random() * 100) + 1;
  return { daily_will_it_rain: rainProbability };
};

// Helper: Check if the weather has high rain probability (over 70%)
const hasHeavyRain = (weather) => {
  return weather && weather.daily_will_it_rain > 70;
};

// Helper: Find the nearest indoor place
const findNearestIndoorPlace = (currentPlace, allPlaces) => {
  const indoorPlaces = allPlaces.filter(
    (place) => place.activityType === 'indoor',
  );

  let nearest = null;
  let minDist = Infinity;

  indoorPlaces.forEach((place) => {
    const dist = getDistance(
      currentPlace.location.lat,
      currentPlace.location.lng,
      place.location.lat,
      place.location.lng,
    );
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
      const dist = getDistance(
        current.location.lat,
        current.location.lng,
        place.location.lat,
        place.location.lng,
      );
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
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Include both start and end dates
  return dayDiff;
};

// Main itinerary generator function
const generateItinerary = async (req, res) => {
  const { interests, startDate, endDate } = req.body;

  if (!interests || !startDate || !endDate) {
    return res.status(400).json({
      error: 'Missing required fields: interests, startDate, endDate',
    });
  }

  // Fetch all places from MongoDB
  const places = await Trip.find();

  // Step 1: Calculate the number of days for the trip
  const days = calculateDaysBetweenDates(startDate, endDate);
  console.log(`Trip duration: ${days} days`);

  // Step 2: Filter all matching places based on interests
  const matchedPlaces = places
    .filter(
      (p) =>
        interests.includes(p.category) ||
        p.tags.some((tag) => interests.includes(tag)),
    )
    .sort((a, b) => b.rating - a.rating);

  if (matchedPlaces.length === 0) {
    return res.status(404).json({ error: 'No places matched your interests.' });
  }

  // Step 3: Find the best starting point (highest rated)
  let startPlace = matchedPlaces[0];
  // Step 4: Order all matched places by nearest-neighbor (across all regions)
  const orderedPlaces = [];
  const visited = new Set();
  let current = startPlace;
  orderedPlaces.push(current);
  visited.add(current.name);
  while (visited.size < matchedPlaces.length) {
    let nearest = null;
    let minDist = Infinity;
    for (const place of matchedPlaces) {
      if (visited.has(place.name)) continue;
      const dist = getDistance(
        current.location.lat,
        current.location.lng,
        place.location.lat,
        place.location.lng,
      );
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

  // Step 5: Split ordered places into days, filling each day up to 8 hours (including travel time)
  const avgSpeed = 40; // km/h
  const itinerary = [];
  let dayIdx = 0;
  let timeLeft = 8;
  let prev = null;
  for (let i = 0; i < orderedPlaces.length; i++) {
    if (dayIdx >= days) break; // Do not exceed the number of trip days
    if (!itinerary[dayIdx])
      itinerary[dayIdx] = { day: dayIdx + 1, activities: [] };
    const activity = orderedPlaces[i];
    let travelTime = 0;
    if (prev) {
      const dist = getDistance(
        prev.location.lat,
        prev.location.lng,
        activity.location.lat,
        activity.location.lng,
      );
      travelTime = dist / avgSpeed;
    }
    if (timeLeft < travelTime + activity.avgTime) {
      dayIdx++;
      timeLeft = 8;
      prev = null;
      i--;
      continue;
    }
    itinerary[dayIdx].activities.push(activity);
    timeLeft -= travelTime + activity.avgTime;
    prev = activity;
  }

  // Step 6: Calculate total estimated cost
  const totalCost = itinerary
    .flatMap((d) => d.activities)
    .reduce((sum, place) => sum + place.avgTicketPrice, 0);

  // Step 7: Calculate total travel distance from starting point through all activities
  let totalDistance = 0;
  for (let d = 0; d < itinerary.length; d++) {
    const activities = itinerary[d].activities;
    for (let a = 0; a < activities.length - 1; a++) {
      totalDistance += getDistance(
        activities[a].location.lat,
        activities[a].location.lng,
        activities[a + 1].location.lat,
        activities[a + 1].location.lng,
      );
    }
    // If not the first day, add distance from last activity of previous day to first activity of this day
    if (
      d > 0 &&
      itinerary[d - 1].activities.length > 0 &&
      activities.length > 0
    ) {
      const prev =
        itinerary[d - 1].activities[itinerary[d - 1].activities.length - 1];
      const curr = activities[0];
      totalDistance += getDistance(
        prev.location.lat,
        prev.location.lng,
        curr.location.lat,
        curr.location.lng,
      );
    }
  }

  // Step 8: Suggest travel mode based on number of people
  let travelMode = 'tuk tuk';
  if (req.body.numPeople >= 4) {
    travelMode = 'van';
  } else if (req.body.numPeople === 4) {
    travelMode = 'car';
  } else if (req.body.numPeople === 3) {
    travelMode = 'tuk tuk';
  } else {
    travelMode = 'bike';
  }

  // Step 9: For each outdoor activity, check weather and suggest nearest indoor place if heavy rain
  for (let d = 0; d < itinerary.length; d++) {
    for (let a = 0; a < itinerary[d].activities.length; a++) {
      const activity = itinerary[d].activities[a];
      if (activity.activityType === 'outdoor') {
        const date = new Date(startDate);
        date.setDate(date.getDate() + d);
        // eslint-disable-next-line no-await-in-loop
        const weather = await getWeather(
          activity.location.lat,
          activity.location.lng,
          date,
        );
        if (hasHeavyRain(weather)) {
          const indoorAlt = findNearestIndoorPlace(activity, places);
          if (indoorAlt) {
            itinerary[d].activities[a].indoorSuggestion = {
              ...indoorAlt,
              suggestedDueToRain: true,
            };
          }
        }
      }
    }
  }

  // Step 10: Calculate total fuel cost (fuel efficiency varies by travel mode)
  const fuelPricePerLitre = 300; // Rs
  let avgKmPerLitre = 12; // default
  if (travelMode === 'bike') avgKmPerLitre = 35;
  else if (travelMode === 'tuk tuk') avgKmPerLitre = 25;
  else if (travelMode === 'car') avgKmPerLitre = 12;
  else if (travelMode === 'van') avgKmPerLitre = 8;
  const totalFuelLitres = totalDistance / avgKmPerLitre;
  const totalFuelCost = Math.round(totalFuelLitres * fuelPricePerLitre);

  // Save itinerary to MongoDB
  await Itinerary.create({
    interests,
    startDate,
    endDate,
    numPeople: req.body.numPeople,
    startingPoint: startPlace.name,
    totalDays: itinerary.length,
    totalDistance: Math.round(totalDistance * 100) / 100,
    travelMode,
    totalFuelCost,
    totalCost,
    itinerary,
    user: req.user.id,
  });

  res.json({
    startingPoint: startPlace.name,
    totalDays: itinerary.length,
    itinerary,
    totalCost,
    totalDistance: Math.round(totalDistance * 100) / 100, // in km, rounded to 2 decimals
    travelMode,
    totalFuelCost, // Rs
  });
};

// Get all itineraries for the logged-in user
export const getUserItineraries = async (req, res) => {
  try {
    const userId = req.user.id;
    const itineraries = await Itinerary.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: itineraries });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch itineraries' });
  }
};

export const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!itinerary) {
      return res
        .status(404)
        .json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete plan' });
  }
};

// Get all itineraries (admin use)
export const getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: itineraries });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch all itineraries' });
  }
};

export { generateItinerary };

