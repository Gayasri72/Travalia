import Vehicle from '../models/vehicle.model.js';
import catchAsync from '../utills/catchAsync.js';
import AppError from '../utills/error.js';

// Create a new vehicle
export const createVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      vehicle,
    },
  });
});

// Get all vehicles
export const getAllVehicles = catchAsync(async (req, res, next) => {
  const vehicles = await Vehicle.find();

  res.status(200).json({
    status: 'success',
    results: vehicles.length,
    data: {
      vehicles,
    },
  });
});

// Update a vehicle by ID
export const updateVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    return next(new AppError('No vehicle found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      vehicle,
    },
  });
});

// Delete a vehicle by ID
export const deleteVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

  if (!vehicle) {
    return next(new AppError('No vehicle found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});