import express from 'express';
import { createVehicle, getAllVehicles, deleteVehicle, updateVehicle } from '../controllers/hireVehicles.controller.js';

const router = express.Router();

// POST /api/vehicles -> Create a new vehicle
router.post('/', createVehicle);

// GET /api/vehicles -> List all vehicles
router.get('/', getAllVehicles);

// DELETE /api/vehicles/:id -> Delete a vehicle
router.delete('/:id', deleteVehicle);

// PATCH /api/vehicles/:id -> Update a vehicle
router.patch('/:id', updateVehicle);

export default router;
