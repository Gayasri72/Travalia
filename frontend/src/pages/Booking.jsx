import { useEffect, useState } from 'react';
import {
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiOutlineBadgeCheck,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:3000/api/bookings/user', {
          credentials: 'include', // send cookie for auth
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <span className="animate-spin text-blue-500 text-4xl mb-2">
            <HiOutlineBadgeCheck />
          </span>
          <div className="text-lg text-blue-700 font-semibold">
            Loading your bookings...
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-blue-900 tracking-tight drop-shadow-lg font-serif italic">
          My Tours
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
                  <img
                    src={
                      booking.tour?.imageCover
                        ? `/src/assets/tours/${booking.tour.imageCover}`
                        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png'
                    }
                    alt="Tour Cover"
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="font-bold text-lg text-gray-800 group-hover:text-blue-700 transition-colors">
                      {booking.tour?.name || 'Tour not found'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Booking ID:{' '}
                      <span className="font-mono">{booking._id}</span>
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
                      {booking.stripeSessionId?.slice(0, 10) || 'N/A'}...
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
                {/* Notification */}
                {booking.notification && (
                  <div className="text-blue-600 font-semibold mt-2 flex items-center gap-2 bg-blue-50 rounded p-2">
                    <HiOutlineBadgeCheck className="text-blue-400" />
                    {booking.notification}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;
