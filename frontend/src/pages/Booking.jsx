import { useEffect, useState } from 'react';

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
    return <div className="text-center mt-8">Loading bookings...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex">
      <div className="flex-1">
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-700 drop-shadow">
            My Tours
          </h2>
          {bookings.length === 0 ? (
            <div className="text-center text-gray-500">No bookings found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-2 border border-gray-100 hover:shadow-2xl transition"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={
                        booking.tour?.imageCover
                          ? `/src/assets/tours/${booking.tour.imageCover}`
                          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png'
                      }
                      alt="Tour Cover"
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow"
                    />
                    <div>
                      <div className="font-bold text-lg text-gray-800">
                        {booking.tour?.name || 'Tour not found'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Booking ID: {booking._id}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                    <span>
                      Date:{' '}
                      <span className="font-semibold">
                        {new Date(booking.createdAt).toLocaleString()}
                      </span>
                    </span>
                    <span>
                      Stripe:{' '}
                      <span className="font-semibold">
                        {booking.stripeSessionId?.slice(0, 10) || 'N/A'}...
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
                  {booking.notification && (
                    <div className="text-blue-600 font-semibold mt-2 flex items-center gap-1">
                      <span>ℹ️</span> {booking.notification}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Booking;
