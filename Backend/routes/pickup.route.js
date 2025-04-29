import express from 'express';
import { createPickup, getAllPickups } from '../controllers/pickup.controller.js';

const router = express.Router();

// Route to create a new pickup
router.post('/', createPickup);

// Route to get all pickups
router.get('/', getAllPickups);

export default router;