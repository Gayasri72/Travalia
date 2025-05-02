import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function DefinedTourBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfirmedBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:3000/api/bookings/all', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          // Filter only confirmed bookings
          setBookings(
            data.data.filter((b) => b.status === 'Tour Booking Confirmed'),
          );
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        setError('Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmedBookings();
  }, []);

  if (loading)
    return <div className="text-center mt-8">Loading confirmed tours...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  // Prepare data for the chart
  const packageCounts = {};
  bookings.forEach((b) => {
    const name = b.tour?.name || 'Unknown';
    packageCounts[name] = (packageCounts[name] || 0) + 1;
  });
  const chartData = {
    labels: Object.keys(packageCounts),
    datasets: [
      {
        label: 'Number of Bookings',
        data: Object.values(packageCounts),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700 drop-shadow">
        Admin Confirmed Tours
      </h2>
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500">
          No confirmed tours found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-8 rounded-2xl shadow-xl bg-white border border-gray-100">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-800 uppercase text-xs tracking-wider">
                  <th className="py-3 px-4 border-b text-center">#</th>
                  <th className="py-3 px-4 border-b text-left">Tour Name</th>
                  <th className="py-3 px-4 border-b text-left">User</th>
                  <th className="py-3 px-4 border-b text-left">
                    Confirmation Date
                  </th>
                  <th className="py-3 px-4 border-b text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, idx) => (
                  <tr key={booking._id} className="hover:bg-blue-50 transition">
                    <td className="py-3 px-4 border-b text-center font-semibold">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 border-b font-bold text-gray-800">
                      {booking.tour?.name || 'Tour not found'}
                    </td>
                    <td className="py-3 px-4 border-b flex items-center gap-2">
                      <img
                        src={
                          booking.user?.profilePicture ||
                          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'
                        }
                        alt="User"
                        className="w-8 h-8 rounded-full border border-gray-200 object-cover shadow"
                      />
                      <span className="font-medium text-gray-700">
                        {booking.user?.username || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b text-gray-600">
                      {new Date(booking.updatedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 border-b text-right text-green-700 font-bold">
                      ${booking.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>{' '}
              Most Booked Packages
            </h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
}

export default DefinedTourBooking;
