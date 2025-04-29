import Pickup from '../models/pickup.model.js';

// Controller to create a new pickup
export const createPickup = async (req, res) => {
  try {
    const { name, contact, flightNumber, pickupTime, destination } = req.body;

    const newPickup = await Pickup.create({
      name,
      contact,
      flightNumber,
      pickupTime,
      destination,
    });

    res.status(201).json({
      status: 'success',
      data: newPickup,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Controller to get all pickups
export const getAllPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find();

    res.status(200).json({
      status: 'success',
      results: pickups.length,
      data: pickups,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};