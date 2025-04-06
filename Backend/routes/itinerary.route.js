import express from 'express';
import { createItinerary } from '../controllers/itinerary.controller.js';

const router = express.Router();

router.post('/generate', createItinerary);

export default router;
