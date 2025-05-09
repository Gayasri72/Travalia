import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Rating is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Prevent duplicate reviews per user per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Populate user info on find
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo email username',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
