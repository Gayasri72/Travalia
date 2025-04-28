import express from 'express';
import {
  createCheckoutSession,
  stripeWebhook,
  getUserBookings,
  getAllBookings,
  confirmBooking,
  deleteBooking,
} from '../controllers/booking.controller.js';
import { verifyToken } from '../utills/verifyUser.js';

const router = express.Router();

// Stripe webhook needs raw body
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook,
);

// Auth middleware should be added for real use
router.post('/create-checkout-session', verifyToken, createCheckoutSession);
router.get('/user', verifyToken, getUserBookings);

// Admin endpoints
router.get('/all', verifyToken, getAllBookings);
router.patch('/confirm/:id', verifyToken, confirmBooking);
router.delete('/:id', verifyToken, deleteBooking);

export default router;
