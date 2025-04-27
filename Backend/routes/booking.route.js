import express from 'express';
import {
  createCheckoutSession,
  stripeWebhook,
  getUserBookings,
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
router.get('/user', getUserBookings);

export default router;
