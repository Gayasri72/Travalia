import { useEffect, useState } from 'react';
import { FaStar, FaTrash, FaUser, FaSearch } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const AllReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAllReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/reviews`, {
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
      const res = await fetch(`${API_URL}/reviews/${id}`, {
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

  // Filter reviews by search
  const filteredReviews = reviews.filter((r) => {
    const searchTerm = search.toLowerCase();
    return (
      r.user?.name?.toLowerCase().includes(searchTerm) ||
      r.user?.username?.toLowerCase().includes(searchTerm) ||
      r.user?.email?.toLowerCase().includes(searchTerm) ||
      r.tour?.name?.toLowerCase().includes(searchTerm) ||
      r.review?.toLowerCase().includes(searchTerm)
    );
  });

  // Helper to convert reviews to CSV
  function reviewsToCSV(reviews) {
    const header = ['User', 'Tour', 'Rating', 'Review', 'Date'];
    const rows = reviews.map((r) => [
      `"${r.user?.name || 'User'}"`,
      `"${r.tour?.name || 'Tour'}"`,
      r.rating,
      `"${r.review.replace(/"/g, '""')}"`,
      new Date(r.createdAt).toLocaleDateString(),
    ]);
    return [header, ...rows].map((row) => row.join(',')).join('\r\n');
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight flex items-center gap-3">
          <FaUser className="text-blue-500 text-3xl" />
          All User Reviews
        </h1>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-gray-700"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => {
              const csv = reviewsToCSV(filteredReviews);
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'reviews_report.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-bold shadow hover:from-blue-700 hover:to-blue-500 transition"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mr-6"></div>
            <span className="text-blue-700 font-semibold text-xl">
              Loading reviews...
            </span>
          </div>
        ) : error ? (
          <div className="text-red-500 font-semibold text-center py-10 text-lg">
            {error}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-gray-500 text-center py-10 text-lg">
            No reviews found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white text-sm rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-blue-50 text-blue-900">
                  <th className="p-4 font-bold">Added By</th>
                  <th className="p-4 font-bold">Username</th>
                  <th className="p-4 font-bold">Tour</th>
                  <th className="p-4 font-bold">Rating</th>
                  <th className="p-4 font-bold">Review</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((r, idx) => (
                  <tr
                    key={r._id}
                    className={
                      idx % 2 === 0
                        ? 'bg-white hover:bg-blue-50 transition'
                        : 'bg-blue-50 hover:bg-blue-100 transition'
                    }
                  >
                    <td className="p-4 flex items-center gap-3">
                      <FaUser className="w-8 h-8 text-blue-400 rounded-full border bg-blue-100 p-1" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-blue-900">
                          {r.user?.name || 'User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {r.user?.email || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-blue-800">
                      {r.user?.username || '-'}
                    </td>
                    <td className="p-4">{r.tour?.name || 'Tour'}</td>
                    <td className="p-4">
                      <span className="flex text-yellow-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs truncate" title={r.review}>
                      {r.review}
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-red-600 hover:text-white hover:bg-red-500 px-3 py-2 rounded-lg border border-red-200 bg-red-50 font-bold transition flex items-center gap-2 disabled:opacity-60"
                        disabled={deletingId === r._id}
                        title="Delete Review"
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
    </div>
  );
};

export default AllReview;
