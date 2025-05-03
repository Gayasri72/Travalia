import Drop from '../models/drop.model.js';
import { catchAsync } from '../utills/catchAsync.js';
import AppError from '../utills/appError.js';

// Create new drop booking
export const createDrop = catchAsync(async (req, res, next) => {
  const drop = await Drop.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      drop
    }
  });
});

// Get all drop bookings
export const getAllDrops = catchAsync(async (req, res, next) => {
  const drops = await Drop.find().populate('vehicle');
  
  res.status(200).json({
    status: 'success',
    results: drops.length,
    data: {
      drops
    }
  });
});

// Get single drop booking
export const getDrop = catchAsync(async (req, res, next) => {
  const drop = await Drop.findById(req.params.id).populate('vehicle');
  
  if (!drop) {
    return next(new AppError('No drop booking found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      drop
    }
  });
});

// Update drop booking
export const updateDrop = catchAsync(async (req, res, next) => {
  const drop = await Drop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!drop) {
    return next(new AppError('No drop booking found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      drop
    }
  });
});

// Delete drop booking
export const deleteDrop = catchAsync(async (req, res, next) => {
  const drop = await Drop.findByIdAndDelete(req.params.id);
  
  if (!drop) {
    return next(new AppError('No drop booking found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Update drop status
export const updateDropStatus = catchAsync(async (req, res, next) => {
  const drop = await Drop.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!drop) {
    return next(new AppError('No drop booking found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      drop
    }
  });
}); 