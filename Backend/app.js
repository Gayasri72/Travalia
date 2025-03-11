import express from 'express';
import morgan from 'morgan';

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

export default app;

console.log('app.js is running');
