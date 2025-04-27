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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="border rounded-lg p-4 shadow">
              <div className="font-bold text-lg">
                {booking.tour?.name || 'Tour not found'}
              </div>
              <div>Date: {new Date(booking.createdAt).toLocaleString()}</div>
              <div>Price: ${booking.price}</div>
              <div>Status: {booking.paid ? 'Paid' : 'Pending'}</div>
              <div>Booking ID: {booking._id}</div>
              <div>Stripe Session: {booking.stripeSessionId}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Booking;
