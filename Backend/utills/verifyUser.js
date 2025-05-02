import jwt from 'jsonwebtoken';
import AppError from './error.js';

export const verifyToken = (req, res, next) => {
  console.log('Cookies:', req.cookies); // Debug log to check cookies
  const token = req.cookies.access_token;

  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verify error:', err); // Debug log for JWT verification
      return next(new AppError('Unauthorized', 401));
    }
    req.user = { _id: user._id || user.id, ...user };
    next();
  });
};
