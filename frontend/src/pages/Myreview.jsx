import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const MyReview = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editReview, setEditReview] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMyReviews = async () => {
      setLoading(true);
      console.log('currentUser:', currentUser); // Debug: log currentUser
      try {
        const url = `${API_URL}/users/${currentUser?.rest?._id}/reviews`;
        console.log('Fetching:', url); // Debug: log fetch URL
        const res = await fetch(url, {
          credentials: 'include',
        });
        console.log('Response status:', res.status); // Debug: log response status
        const data = await res.json();
        console.log('Fetched data:', data); // Debug: log fetched data
        if (!data.success)
          throw new Error(data.message || 'Failed to fetch reviews');
        setReviews(data.data.reviews);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err); // Debug: log error
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.rest?._id) fetchMyReviews();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete review');
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditReview(review.review);
    setEditRating(review.rating);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reviews/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ review: editReview, rating: editRating }),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || 'Failed to update review');
      setReviews(
        reviews.map((r) =>
          r._id === editingId
            ? { ...r, review: editReview, rating: editRating }
            : r,
        ),
      );
      setEditingId(null);
      setEditReview('');
      setEditRating(5);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser)
    return (
      <p className="text-center mt-10">Please sign in to view your reviews.</p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-blue-900 tracking-tight drop-shadow-lg font-serif italic">
        My Reviews
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reviews.length === 0 ? (
        <p>You have not posted any reviews yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <li
              key={r._id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 border border-blue-100 hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                  {/* User initials or avatar */}
                  {currentUser?.rest?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-semibold text-blue-900">
                    {currentUser?.rest?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="ml-auto flex gap-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
              </div>
              {editingId === r._id ? (
                <form
                  onSubmit={handleUpdate}
                  className="flex flex-col gap-3 animate-fade-in"
                >
                  <textarea
                    value={editReview}
                    onChange={(e) => setEditReview(e.target.value)}
                    className="w-full p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 bg-blue-50"
                    rows={3}
                    required
                  />
                  <div className="flex items-center gap-4">
                    <select
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                      className="p-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-blue-900 font-semibold"
                    >
                      {[5, 4, 3, 2, 1].map((val) => (
                        <option key={val} value={val}>
                          {val} Star{val > 1 && 's'}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 shadow disabled:opacity-60 transition-all"
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="bg-gray-200 px-5 py-2 rounded-lg font-bold hover:bg-gray-300 text-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-700 text-base mb-2">{r.review}</p>
              )}
              <div className="flex gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(r)}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded-full bg-blue-50 hover:bg-blue-100 shadow"
                  title="Edit Review"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded-full bg-red-50 hover:bg-red-100 shadow"
                  title="Delete Review"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="text-xs text-blue-400 mt-2 italic">
                {r.tour?.name || 'Tour'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReview;
