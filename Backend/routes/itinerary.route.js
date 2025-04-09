import express from 'express';
import {generateItinerary} from '../controllers/itinerary.controller.js';

const router = express.Router();

router.post('/generate', generateItinerary);

export default router;
