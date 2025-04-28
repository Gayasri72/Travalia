import Vehicle from "../models/vehicle.model";
import AppError from "../utills/error.js";


export const createVehicle = async (req, res, next) => {
  const vehicle = await Vehicle.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { vehicle },
  });
};

export const getAllVehicles = async (req, res, next) => {
  const vehicles = await Vehicle.find();

  res.status(200).json({
    status: 'success',
    results: vehicles.length,
    data: { vehicles },
  });
};

export const deleteVehicle = async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

  if (!vehicle) return next(new AppError('No vehicle found with that ID', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
