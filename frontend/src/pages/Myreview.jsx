import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';

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
        const url = `http://localhost:3000/api/users/${currentUser?.rest?._id}/reviews`;
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
      const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
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
      const res = await fetch(
        `http://localhost:3000/api/reviews/${editingId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ review: editReview, rating: editRating }),
        },
      );
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
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-blue-900 tracking-tight drop-shadow-lg font-serif italic">My Reviews</h1>
      {/* <div className="mb-4 text-xs text-gray-500">
        Debug: currentUser = {JSON.stringify(currentUser)}
      </div> */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reviews.length === 0 ? (
        <p>You have not posted any reviews yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <li
              key={r._id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-2">
                <span className="font-bold text-gray-800 mr-2">
                  {r.tour?.name || 'Tour'}
                </span>
                <span className="flex text-yellow-500 text-sm">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </span>
                <span className="ml-auto flex gap-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </span>
              </div>
              {editingId === r._id ? (
                <form onSubmit={handleUpdate} className="flex flex-col gap-2">
                  <textarea
                    value={editReview}
                    onChange={(e) => setEditReview(e.target.value)}
                    className="w-full p-2 rounded border"
                    rows={3}
                    required
                  />
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(Number(e.target.value))}
                    className="p-2 rounded border w-32"
                  >
                    {[5, 4, 3, 2, 1].map((val) => (
                      <option key={val} value={val}>
                        {val} Star{val > 1 && 's'}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-3 py-1 rounded font-bold hover:bg-blue-700 disabled:opacity-60"
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 px-3 py-1 rounded font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-700 flex-1 mb-2">{r.review}</p>
              )}
              <div className="text-xs text-gray-400 mt-auto text-right">
                {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReview;
