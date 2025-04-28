import express from 'express';
import { createVehicle, getAllVehicles, deleteVehicle } from '../controllers/vehicle.controller.js';

const router = express.Router();

// POST /api/v1/vehicles -> create vehicle
router.post('/', createVehicle);

// GET /api/v1/vehicles -> list all vehicles
router.get('/', getAllVehicles);

// DELETE /api/v1/vehicles/:id -> delete a vehicle
router.delete('/:id', deleteVehicle);

export default router;
