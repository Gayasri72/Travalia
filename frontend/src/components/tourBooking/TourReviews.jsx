import React, { useEffect, useState } from 'react'
import {
  FaStar,
  FaUserCircle,
} from 'react-icons/fa';

function TourReviews({ tourId, currentUser }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
  
    useEffect(() => {
      const fetchReviews = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `http://localhost:3000/api/tours/${tourId}/reviews`,
          );
          const data = await res.json();
          if (!data.success) throw new Error('Failed to fetch reviews');
          setReviews(data.data.reviews);
          if (currentUser) {
            setHasReviewed(
              data.data.reviews.some(
                (r) => r.user && r.user._id === currentUser._id,
              ),
            );
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchReviews();
    }, [tourId, currentUser]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:3000/api/tours/${tourId}/reviews`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ rating, review }),
          },
        );
        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || 'Failed to submit review');
        setReviews([data.data.review, ...reviews]);
        setHasReviewed(true);
        setReview('');
        setRating(5);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    };
  
    return (
      <div>
        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {reviews.length === 0 && <p>No reviews yet.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-md p-5 flex flex-col h-full hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex items-center mb-3">
                    <FaUserCircle className="w-12 h-12 text-blue-400 mr-4" />
                    <div>
                      <span className="font-bold text-blue-800 text-lg">
                        {r.user?.name || 'User'}
                      </span>
                      <div className="flex text-yellow-400 text-base mt-1">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 flex-1 mb-3 italic">“{r.review}”</p>
                  <div className="text-xs text-gray-400 mt-auto text-right">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <hr className="my-8 border-blue-100" />
        {/* Review Modal Trigger */}
        {currentUser && !hasReviewed && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow"
            >
              Write a Review
            </button>
          </div>
        )}
        {/* Review Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <form onSubmit={handleSubmit} className="flex flex-col">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Submit Your Review</h3>
                <label className="block mb-2 font-bold text-blue-800">Your Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="mb-4 p-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-400"
                >
                  {[5, 4, 3, 2, 1].map((val) => (
                    <option key={val} value={val}>
                      {val} Star{val > 1 && 's'}
                    </option>
                  ))}
                </select>
                <label className="block mb-2 font-bold text-blue-800">Your Review:</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                  className="w-full p-3 rounded border border-blue-200 mb-4 focus:ring-2 focus:ring-blue-400"
                  rows={3}
                  placeholder="Share your experience..."
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-60 transition-colors"
                  disabled={submitting || !review.trim()}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        )}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-green-500 text-4xl mb-2">✓</div>
              <div className="text-lg font-semibold mb-1">Review submitted!</div>
              <div className="text-gray-500">Thank you for your feedback.</div>
            </div>
          </div>
        )}
        {currentUser && hasReviewed && (
          <p className="text-green-600 font-semibold text-center mt-4">
            You have already reviewed this tour.
          </p>
        )}
      </div>
    );
  }

export default TourReviews