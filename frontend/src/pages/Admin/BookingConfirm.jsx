import { useEffect, useState } from 'react';

function BookingConfirm() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:3000/api/bookings/all', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setBookings(data.data);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        setError('Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleConfirm = async (bookingId) => {
    try {
      await fetch(`http://localhost:3000/api/bookings/confirm/${bookingId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: 'Tour Booking Confirmed' } : b,
        ),
      );
    } catch (err) {
      alert('Failed to confirm booking');
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      await fetch(`http://localhost:3000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      alert('Failed to delete booking');
    }
  };

  if (loading)
    return <div className="text-center mt-8">Loading bookings...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700 drop-shadow">
        All Bookings
      </h2>
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500">No bookings found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-2 border border-gray-100 hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                  {booking.user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-800">
                    {booking.tour?.name || 'Tour not found'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.user?.username || 'N/A'} (
                    {booking.user?.email || 'N/A'})
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                <span>
                  Booking:{' '}
                  <span className="font-semibold">
                    {new Date(booking.createdAt).toLocaleString()}
                  </span>
                </span>
                <span>
                  Paid:{' '}
                  <span className="font-semibold">
                    {new Date(booking.updatedAt).toLocaleString()}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-green-700">
                  ${booking.price}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ml-2 ${booking.status === 'Tour Booking Confirmed' ? 'bg-green-100 text-green-700' : booking.paid ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-500'}`}
                >
                  {booking.status || (booking.paid ? 'Paid' : 'Pending')}
                </span>
              </div>
              {booking.status !== 'Tour Booking Confirmed' && (
                <div className="mt-2 flex gap-2">
                  <button
                    className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
                    onClick={() => handleConfirm(booking._id)}
                  >
                    <span>✔</span> Confirm
                  </button>
                  <button
                    className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
                    onClick={() => handleDelete(booking._id)}
                  >
                    <span>🗑</span> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingConfirm;
