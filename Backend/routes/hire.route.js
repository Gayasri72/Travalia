import express from 'express';
import {
  createPickupBooking,
  createDropBooking,
  getAllBookings,
  getBooking,
  updateBookingStatus
} from '../controllers/hire.controller.js';
import { verifyToken } from '../utills/verifyUser.js';

const router = express.Router();

// Public routes
router.post('/pickup', createPickupBooking);
router.post('/drop', createDropBooking);

// Protected routes (require authentication)
router.get('/all', verifyToken, getAllBookings);
router.get('/:id', verifyToken, getBooking);
router.patch('/:id/status', verifyToken, updateBookingStatus);

export default router;