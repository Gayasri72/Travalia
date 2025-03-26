import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log('Received Token:', token); // Log the token
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verification error:', err); // Log the error
      return next(errorHandler(401, 'Unauthorized'));
    }
    req.user = user;
    next();
  });
};
