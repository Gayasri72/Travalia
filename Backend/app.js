import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import tourRoutes from './routes/tour.route.js';
import vehicleRoutes from './routes/vehicle.route.js';
import pickupRoutes from './routes/pickup.route.js';
import dropRoutes from './routes/drop.route.js';

const app = express();
app.use(express.json());

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());

export default app;

console.log('app.js is running');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/pick', pickupRoutes);
app.use('/api/drop', dropRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
