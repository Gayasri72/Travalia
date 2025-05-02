import express from 'express';
import {
  generateItinerary,
  getUserItineraries,
  deleteItinerary,
  getAllItineraries,
  saveItinerary, // <-- add this import
} from '../controllers/itinerary.controller.js';
import { verifyToken } from '../utills/verifyUser.js';

const router = express.Router();

// router.post('/generate', generateItinerary);

router.post('/generate', verifyToken, generateItinerary);
router.post('/', verifyToken, saveItinerary); // <-- add this route for saving confirmed plans
router.get('/user', verifyToken, getUserItineraries);
router.delete('/:id', verifyToken, deleteItinerary);
router.get('/', getAllItineraries);

export default router;
