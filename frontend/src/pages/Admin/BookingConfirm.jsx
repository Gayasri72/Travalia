import { useEffect, useState } from 'react';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiOutlineBadgeCheck,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

const API_URL = import.meta.env.VITE_API_URL;

function BookingConfirm() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/bookings/all`, {
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
      await fetch(`${API_URL}/bookings/confirm/${bookingId}`, {
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
      await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      alert('Failed to delete booking');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <span className="animate-spin text-blue-500 text-4xl mb-2">
            <HiOutlineBadgeCheck />
          </span>
          <div className="text-lg text-blue-700 font-semibold">
            Loading all bookings...
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <div className="flex flex-col items-center">
          <span className="text-red-400 text-4xl mb-2">
            <HiOutlineExclamationCircle />
          </span>
          <div className="text-lg text-red-600 font-semibold">{error}</div>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-800 tracking-tight drop-shadow-lg">
        All Bookings
      </h2>
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-5xl text-gray-300 mb-4">
            <HiOutlineCalendar />
          </span>
          <div className="text-xl text-gray-500 font-medium">
            No bookings found.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-gray-100 hover:shadow-2xl transition-all duration-200 group relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 shadow">
                  {booking.user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors">
                    {booking.tour?.name || 'Tour not found'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <HiOutlineUser /> {booking.user?.username || 'N/A'}
                    <HiOutlineMail /> {booking.user?.email || 'N/A'}
                  </div>
                </div>
              </div>
              {/* Card Details */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <HiOutlineCalendar className="text-blue-400" />
                  <span className="font-semibold">
                    {new Date(booking.createdAt).toLocaleString()}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <HiOutlineCreditCard className="text-green-400" />
                  <span className="font-semibold">
                    {new Date(booking.updatedAt).toLocaleString()}
                  </span>
                </span>
              </div>
              {/* Price and Status */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-green-700 flex items-center gap-1">
                  ${booking.price}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 shadow-sm border ${booking.status === 'Tour Booking Confirmed' ? 'bg-green-100 text-green-700 border-green-200' : booking.paid ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
                >
                  {booking.status || (booking.paid ? 'Paid' : 'Pending')}
                </span>
              </div>
              {/* Actions */}
              {booking.status !== 'Tour Booking Confirmed' && (
                <div className="mt-2 flex gap-2">
                  <button
                    className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition font-semibold text-sm"
                    onClick={() => handleConfirm(booking._id)}
                  >
                    <HiOutlineCheckCircle className="text-lg" /> Confirm
                  </button>
                  <button
                    className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition font-semibold text-sm"
                    onClick={() => handleDelete(booking._id)}
                  >
                    <HiOutlineTrash className="text-lg" /> Delete
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
