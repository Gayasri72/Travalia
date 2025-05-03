import Vehicle from '../models/vehicle.model.js';
import AppError from "../utills/error.js";

// Create a new vehicle
export const createVehicle = async (req, res, next) => {
  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { vehicle },
  });
};

// Get all vehicles
export const getAllVehicles = async (req, res, next) => {
  const vehicles = await Vehicle.find();

  res.status(200).json({
    status: 'success',
    results: vehicles.length,
    data: { vehicles },
  });
};

// Delete a vehicle
export const deleteVehicle = async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

  if (!vehicle) return next(AppError(404, 'No vehicle found with that ID'));

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Update a vehicle
export const updateVehicle = async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,  // return updated document
    runValidators: true, // validate fields
  });

  if (!vehicle) return next(errorHandler(404, 'No vehicle found with that ID'));

  res.status(200).json({
    status: 'success',
    data: { vehicle },
  });
};
