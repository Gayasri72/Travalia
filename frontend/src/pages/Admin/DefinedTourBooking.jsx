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
  const [search, setSearch] = useState('');

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

  // Filter bookings by search
  const filteredBookings = bookings.filter(
    (b) =>
      b.tour?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.username?.toLowerCase().includes(search.toLowerCase()),
  );

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
        borderRadius: 8,
        barPercentage: 0.6,
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
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow-sm">
          Admin Confirmed Tours
        </h2>
        <input
          type="text"
          placeholder="Search by tour or user..."
          className="w-full md:w-72 px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-6 text-blue-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
            Most Booked Packages
          </h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl shadow-2xl border border-blue-100 p-8 flex flex-col justify-center items-center">
          <span className="text-6xl mb-2 font-bold text-blue-700">
            {bookings.length}
          </span>
          <span className="text-lg text-blue-600 font-medium">
            Total Confirmed Bookings
          </span>
        </div>
      </div>
      {loading ? (
        <div className="text-center mt-8 animate-pulse text-blue-600 font-semibold">
          Loading confirmed tours...
        </div>
      ) : error ? (
        <div className="text-center mt-8 text-red-500 font-semibold">
          {error}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center text-gray-500 mt-12 text-lg">
          No confirmed tours found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBookings.map((booking, idx) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-2xl transition-shadow duration-200 group"
            >
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={
                    booking.user?.profilePicture ||
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'
                  }
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-blue-200 object-cover shadow group-hover:scale-105 transition-transform"
                />
                <div>
                  <div className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    {booking.user?.username || 'N/A'}
                    <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 font-semibold">
                      User
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {booking.user?.email || ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-3 h-3 rounded-full bg-green-400"></span>
                <span className="font-semibold text-green-700 text-sm">
                  Confirmed
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-blue-700">Tour:</span>{' '}
                <span className="font-bold text-gray-900">
                  {booking.tour?.name || 'Tour not found'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-gray-600 text-sm">
                  <span className="font-semibold">Confirmed on:</span>{' '}
                  {new Date(booking.updatedAt).toLocaleString()}
                </div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-lg shadow-sm border border-green-200">
                  ${booking.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DefinedTourBooking;
