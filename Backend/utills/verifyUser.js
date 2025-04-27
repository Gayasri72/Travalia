import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  console.log('Cookies:', req.cookies); // Debug log to check cookies
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verify error:', err); // Debug log for JWT verification
      return next(errorHandler(401, 'Unauthorized'));
    }
    req.user = user;
    next();
  });
};
