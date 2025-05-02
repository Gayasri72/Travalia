import express from 'express';
import {
  createReview,
  getTourReviews,
  updateReview,
  deleteReview,
  getUserReviews,
  getAllReviews,
} from '../controllers/review.controller.js';
import { verifyToken } from '../utills/verifyUser.js';

const router = express.Router({ mergeParams: true });

// POST /api/tours/:tourId/reviews - create review for a tour (user must be logged in)
router.post('/tours/:tourId/reviews', verifyToken, createReview);

// GET /api/tours/:tourId/reviews - get all reviews for a tour
router.get('/tours/:tourId/reviews', getTourReviews);

// GET /api/users/:userId/reviews - get all reviews by a user
router.get('/users/:userId/reviews', getUserReviews);

// GET /api/reviews - get all reviews with user and tour info (admin only)
router.get('/reviews', getAllReviews);

// PATCH /api/reviews/:id - update review (user must be owner)
router.patch('/reviews/:id', verifyToken, updateReview);

// DELETE /api/reviews/:id - delete review (user must be owner)
router.delete('/reviews/:id', verifyToken, deleteReview);

export default router;
