import Pickup from '../models/pickup.model.js';
import { catchAsync } from '../utills/catchAsync.js';
import AppError from '../utills/appError.js';

// Create new pickup booking
export const createPickup = catchAsync(async (req, res, next) => {
  const pickup = await Pickup.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      pickup
    }
  });
});

// Get all pickup bookings
export const getAllPickups = catchAsync(async (req, res, next) => {
  const pickups = await Pickup.find().populate('vehicle');
  
  res.status(200).json({
    status: 'success',
    results: pickups.length,
    data: {
      pickups
    }
  });
});

// Get single pickup booking
export const getPickup = catchAsync(async (req, res, next) => {
  const pickup = await Pickup.findById(req.params.id).populate('vehicle');
  
  if (!pickup) {
    return next(new AppError('No pickup booking found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      pickup
    }
  });
});

// Update pickup booking
export const updatePickup = catchAsync(async (req, res, next) => {
  const pickup = await Pickup.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!pickup) {
    return next(new AppError('No pickup booking found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      pickup
    }
  });
});

// Delete pickup booking
export const deletePickup = catchAsync(async (req, res, next) => {
  const pickup = await Pickup.findByIdAndDelete(req.params.id);
  
  if (!pickup) {
    return next(new AppError('No pickup booking found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Update pickup status
export const updatePickupStatus = catchAsync(async (req, res, next) => {
  const pickup = await Pickup.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!pickup) {
    return next(new AppError('No pickup booking found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      pickup
    }
  });
}); 