import Review from '../models/review.model.js';

// Create a review
export const createReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const tour = req.params.tourId || req.body.tour;
    const user = req.user._id;
    const newReview = await Review.create({ review, rating, tour, user });
    res.status(201).json({ success: true, data: { review: newReview } });
  } catch (err) {
    // Handle duplicate review error (one review per user per tour)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this tour.',
      });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all reviews for a tour
export const getTourReviews = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    const reviews = await Review.find({ tour: tourId });
    res.status(200).json({ success: true, data: { reviews } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update a review (only by the review owner)
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true },
    );
    if (!review)
      return res.status(404).json({
        success: false,
        message: 'Review not found or not authorized',
      });
    res.status(200).json({ success: true, data: { review } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete a review (only by the review owner)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!review)
      return res.status(404).json({
        success: false,
        message: 'Review not found or not authorized',
      });
    res.status(204).json({ success: true, data: null });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all reviews by a user
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await Review.find({ user: userId }).populate(
      'tour',
      'name',
    );
    res.status(200).json({ success: true, data: { reviews } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all reviews (admin)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name photo')
      .populate('tour', 'name');
    res.status(200).json({ success: true, data: { reviews } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
