import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDropBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/drop/drop-bookings"); // Ensure correct endpoint
      setBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(`/api/drop/drop-bookings/${id}`);
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Drop Bookings</h2>

      {/* Error message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading bookings...</p>
        ) : bookings.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-6 text-left">Customer Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Pickup Location</th>
                <th className="py-3 px-6 text-left">Drop Location</th>
                <th className="py-3 px-6 text-left">Date & Time</th>
                <th className="py-3 px-6 text-left">Vehicle</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b">
                  <td className="py-3 px-6">{booking.customerName}</td>
                  <td className="py-3 px-6">{booking.email}</td>
                  <td className="py-3 px-6">{booking.phoneNo}</td>
                  <td className="py-3 px-6">{booking.pickupLocation}</td>
                  <td className="py-3 px-6">{booking.dropLocation}</td>
                  <td className="py-3 px-6">{new Date(booking.dateTime).toLocaleString()}</td>
                  <td className="py-3 px-6">{booking.vehicleName}</td>
                  <td className="py-3 px-6 space-x-2">
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
}