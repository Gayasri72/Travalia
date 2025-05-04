import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importing jsPDF and autoTable for PDF generation

const TourPackages = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tours/admin');
        const data = await response.json();

        if (Array.isArray(data.data.tours)) {
          setTourPackages(data.data.tours);
        } else {
          setErrorMessage('Invalid data format received');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching packages');
      }
    };

    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/tours/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setTourPackages(tourPackages.filter((tour) => tour._id !== id));
        } else {
          setErrorMessage('Failed to delete package');
        }
      } catch (error) {
        setErrorMessage('An error occurred while deleting');
      }
    }
  };

  const handleDownloadReport = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'A4',
    });
    doc.setFontSize(18);
    doc.text('Tour Packages Report', 40, 30);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 40, 45);
    const tableHead = [
      'No.',
      'Tour Name',
      'Duration',
      'Price',
      'Difficulty',
      'Max Group Size',
      'Guides',
      'Locations',
    ];
    const tableData = filteredPackages.map((tour, idx) => [
      idx + 1,
      tour.name,
      tour.duration,
      `$${tour.price}`,
      tour.difficulty,
      tour.maxGroupSize,
      (tour.guides || []).join(', '),
      (tour.locations || []).map((l) => l.description).join(' | '),
    ]);
    autoTable(doc, {
      startY: 60,
      head: [tableHead],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellWidth: 'wrap' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10 },
      columnStyles: {
        7: { cellWidth: 200 },
      },
    });
    doc.save('tour-packages-report.pdf');
  };

  const filteredPackages = tourPackages.filter((tour) =>
    tour.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur border-b border-blue-100 shadow flex items-center justify-between px-10 py-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 flex items-center gap-3 drop-shadow">
          <svg
            className="w-9 h-9 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 4v16m8-8H4"></path>
          </svg>
          Tour Packages
        </h1>
        <button
          onClick={handleDownloadReport}
          className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white px-6 py-3 rounded-xl text-base font-bold shadow-lg transition-all flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path>
          </svg>
          Download Report
        </button>
      </header>
      <main className="flex-1 w-full px-0 md:px-8 py-8">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 px-4 md:px-0">
          <Link
            to="/admin/addpackages"
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-8 py-3 rounded-2xl text-lg font-bold shadow-xl transition-all flex items-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 4v16m8-8H4"></path>
            </svg>
            Add New Tour Package
          </Link>
          <input
            type="text"
            placeholder="Search by tour name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 border border-blue-200 rounded-xl px-5 py-3 text-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow bg-white"
          />
        </div>
        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 text-center animate-pulse mx-4 md:mx-0">
            {errorMessage}
          </div>
        )}
        <div className="overflow-x-auto w-full px-2 md:px-0">
          <div className="bg-white/90 rounded-3xl shadow-2xl border border-blue-100 p-4 md:p-8">
            <table className="min-w-full table-auto text-gray-700 text-base">
              <thead>
                <tr className="bg-blue-100 text-blue-700 uppercase text-xs md:text-sm tracking-wider">
                  <th className="px-6 py-4 text-left">Tour Name</th>
                  <th className="px-6 py-4 text-left">Duration (days)</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.length > 0 ? (
                  filteredPackages.map((tour) => (
                    <tr
                      key={tour._id}
                      className="border-b hover:bg-blue-50/70 transition group"
                    >
                      <td className="px-6 py-4 font-semibold text-blue-900 group-hover:underline max-w-xs truncate">
                        {tour.name}
                      </td>
                      <td className="px-6 py-4">{tour.duration}</td>
                      <td className="px-6 py-4 font-bold text-green-600">
                        ${tour.price}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/packages/edit/${tour._id}`)
                          }
                          className="bg-yellow-400 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-yellow-500 transition flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17v4h4l10.293-10.293a1 1 0 00-1.414-1.414L3 17z"></path>
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tour._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500 text-lg"
                    >
                      No packages found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TourPackages;
