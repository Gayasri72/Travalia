import express from 'express';
import {
  generateItinerary,
  getUserItineraries,
  deleteItinerary,
  getAllItineraries,
} from '../controllers/itinerary.controller.js';
import { verifyToken } from '../utills/verifyUser.js';

const router = express.Router();

router.post('/generate', verifyToken, generateItinerary);
router.get('/user', verifyToken, getUserItineraries);
router.delete('/:id', verifyToken, deleteItinerary);
router.get('/', getAllItineraries);

export default router;
