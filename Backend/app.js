import express from 'express';
import morgan from 'morgan';
import userRoutes from './routes/user.route.js';

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

export default app;

console.log('app.js is running');

app.use('/api/users', userRoutes);
