import { useEffect, useState } from 'react';
import { FaStar, FaTrash } from 'react-icons/fa';

const AllReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchAllReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/reviews', {
          credentials: 'include',
        });
        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || 'Failed to fetch reviews');
        setReviews(data.data.reviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete review');
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to convert reviews to CSV
  function reviewsToCSV(reviews) {
    const header = ['User', 'Tour', 'Rating', 'Review', 'Date'];
    const rows = reviews.map(r => [
      `"${r.user?.name || 'User'}"`,
      `"${r.tour?.name || 'Tour'}"`,
      r.rating,
      `"${r.review.replace(/"/g, '""')}"`,
      new Date(r.createdAt).toLocaleDateString()
    ]);
    return [header, ...rows].map(row => row.join(',')).join('\r\n');
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All User Reviews</h1>
      <button
        onClick={() => {
          const csv = reviewsToCSV(reviews);
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'reviews_report.csv';
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
      >
        Export as CSV
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">User</th>
                <th className="p-3">Tour</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Review</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={
                        r.user?.photo
                          ? r.user.photo.startsWith('http')
                            ? r.user.photo
                            : `/uploads/${r.user.photo}`
                          : '/default-user.png'
                      }
                      alt={r.user?.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <span className="font-medium">{r.user?.name || 'User'}</span>
                  </td>
                  <td className="p-3">{r.tour?.name || 'Tour'}</td>
                  <td className="p-3">
                    <span className="flex text-yellow-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </span>
                  </td>
                  <td className="p-3 max-w-xs truncate" title={r.review}>
                    {r.review}
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-200 bg-red-50"
                      disabled={deletingId === r._id}
                    >
                      {deletingId === r._id ? 'Deleting...' : <FaTrash />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllReview;
