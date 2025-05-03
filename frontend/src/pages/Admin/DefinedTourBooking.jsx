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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse'; // use this library to parse CSV data
import { saveAs } from 'file-saver'; // use this library to save files
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Helper to filter bookings by date range
const filterByDateRange = (bookings, range) => {
  const now = new Date();
  return bookings.filter((b) => {
    const date = new Date(b.updatedAt);
    if (range === 'daily') {
      return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }
    if (range === 'weekly') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo && date <= now;
    }
    if (range === 'monthly') {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });
};

// Helper to get most booked tours
const getMostBookedTours = (bookings) => {
  const counts = {};
  bookings.forEach((b) => {
    const name = b.tour?.name || 'Unknown';
    counts[name] = (counts[name] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
};

function DefinedTourBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState('pdf');
  const [exportRange, setExportRange] = useState('daily');

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

  // Export CSV
  const handleExportCSV = (range) => {
    const filtered = filterByDateRange(bookings, range);
    const csv = Papa.unparse(
      filtered.map((b) => ({
        Username: b.user?.username,
        Email: b.user?.email,
        Tour: b.tour?.name,
        Price: b.price,
        Status: b.status,
        ConfirmedOn: new Date(b.updatedAt).toLocaleString(),
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `tour-bookings-${range}.csv`);
  };

  // Export PDF
  const handleExportPDF = (range) => {
    const filtered = filterByDateRange(bookings, range);
    const doc = new jsPDF();
    doc.text(`Tour Bookings Report (${range})`, 14, 14);
    if (filtered.length > 0) {
      autoTable(doc, {
        head: [['Username', 'Email', 'Tour', 'Price', 'Status', 'Confirmed On']],
        body: filtered.map((b) => [
          b.user?.username || '',
          b.user?.email || '',
          b.tour?.name || '',
          b.price || '',
          b.status || '',
          b.updatedAt ? new Date(b.updatedAt).toLocaleString() : '',
        ]),
        startY: 20,
      });
      // Most booked tours
      const mostBooked = getMostBookedTours(filtered);
      doc.text('Most Booked Tours:', 14, doc.lastAutoTable.finalY + 10);
      autoTable(doc, {
        head: [['Tour Name', 'Bookings']],
        body: mostBooked.map((t) => [t.name, t.count]),
        startY: doc.lastAutoTable.finalY + 15,
      });
    } else {
      doc.text('No data available for this period.', 14, 30);
    }
    doc.save(`tour-bookings-${range}.pdf`);
  };

  // Export handler
  const handleExport = () => {
    if (exportType === 'pdf') {
      handleExportPDF(exportRange);
    } else {
      handleExportCSV(exportRange);
    }
    setExportDialogOpen(false);
  };

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
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>Export Bookings Report</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="export-type-label">Export Type</InputLabel>
            <Select
              labelId="export-type-label"
              value={exportType}
              label="Export Type"
              onChange={(e) => setExportType(e.target.value)}
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="export-range-label">Report Range</InputLabel>
            <Select
              labelId="export-range-label"
              value={exportRange}
              label="Report Range"
              onChange={(e) => setExportRange(e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleExport} variant="contained" color="primary">
            Export
          </Button>
        </DialogActions>
      </Dialog>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow-sm">
          Admin Confirmed Tours
        </h2>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by tour or user..."
            className="w-full md:w-72 px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setExportDialogOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded font-semibold shadow hover:from-green-600 hover:to-blue-600 transition"
            style={{ minWidth: 120 }}
          >
            Export Report
          </button>
        </div>
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