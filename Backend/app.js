import express from 'express';
import morgan from 'morgan';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import tourRoutes from './routes/tour.route.js';

const app = express();
app.use(express.json());

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

export default app;

console.log('app.js is running');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
