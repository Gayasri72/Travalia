import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import tourRoutes from './routes/tour.route.js';

import cookieParser from 'cookie-parser';

import itineraryRoutes from './routes/itinerary.route.js';
import bookingRoutes from './routes/booking.route.js';
import { stripeWebhook } from './controllers/booking.controller.js';

const app = express();

// Register Stripe webhook route BEFORE express.json()
app.post(
  '/api/bookings/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook,
);

app.use(express.json());
app.use(cookieParser());
// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(
  cors({
    origin: 'http://localhost:5173', // your frontend URL
    credentials: true,
  }),
);

export default app;

console.log('app.js is running');
// user routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
// tour routes
app.use('/api/tours', tourRoutes);

// itinerary routes
app.use('/api/itineraries', itineraryRoutes);
// booking routes

app.use('/api/bookings', bookingRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
