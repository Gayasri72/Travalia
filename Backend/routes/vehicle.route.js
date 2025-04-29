import express from 'express';
import { createVehicle, getAllVehicles, deleteVehicle, updateVehicle } from '../controllers/vehicle.controller.js';

const router = express.Router();

// POST /api/v1/vehicles -> Create a new vehicle
router.post('/', createVehicle);

// GET /api/v1/vehicles -> List all vehicles
router.get('/', getAllVehicles);

// DELETE /api/v1/vehicles/:id -> Delete a vehicle
router.delete('/:id', deleteVehicle);

// PATCH /api/v1/vehicles/:id -> Update a vehicle
router.patch('/:id', updateVehicle);

export default router;
