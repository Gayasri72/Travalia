import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";  

const TourPackages = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tours');
        const data = await response.json();
        if (Array.isArray(data.data.tours)) {
          setTourPackages(data.data.tours);
          setFilteredPackages(data.data.tours);
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

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = tourPackages.filter((tour) =>
      tour.name.toLowerCase().includes(term)
    );
    setFilteredPackages(filtered);
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Tour Packages Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
    const tableColumn = [
      'Tour Name',
      'Duration (days)',
      'Group Size',
      'Difficulty',
      'Price ($)',
      'Discount ($)'
    ];
    const tableRows = [];
  
    filteredPackages.forEach((tour) => {
      const tourData = [
        tour.name,
        tour.duration,
        tour.maxGroupSize,
        tour.difficulty,
        tour.price,
        tour.priceDiscount || 'N/A'
      ];
      tableRows.push(tourData);
    });

    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
    });
  
    doc.save('Tour_Packages_Report.pdf');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Tour Packages</h1>

        {errorMessage && (
          <p className="text-red-600 text-center bg-red-100 p-3 rounded-md mb-4">{errorMessage}</p>
        )}

        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-500">{filteredPackages.length} Packages Found</span>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by tour name"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              onClick={generateReport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-green-700"
            >
              Generate Report
            </button>
            <Link
              to="/admin/addpackages"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700"
            >
              + Add New Tour Package
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="w-full table-auto text-gray-700">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                <th className="px-6 py-4 text-left">Tour Name</th>
                <th className="px-6 py-4 text-left">Duration (days)</th>
                <th className="px-6 py-4 text-left">Group Size</th>
                <th className="px-6 py-4 text-left">Difficulty</th>
                <th className="px-6 py-4 text-left">Price ($)</th>
                <th className="px-6 py-4 text-left">Discount ($)</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.length > 0 ? (
                filteredPackages.map((tour) => (
                  <tr key={tour._id} className="border-b hover:bg-blue-100 transition">
                    <td className="px-6 py-4 font-medium flex items-center space-x-2">
                      <img src={tour.image || '/default-avatar.png'} alt="tour" className="w-8 h-8 rounded-full" />
                      <span>{tour.name}</span>
                    </td>
                    <td className="px-6 py-4">{tour.duration}</td>
                    <td className="px-6 py-4">{tour.maxGroupSize}</td>
                    <td className="px-6 py-4">{tour.difficulty}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">${tour.price}</td>
                    <td className="px-6 py-4">{tour.priceDiscount || 'N/A'}</td>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/packages/edit/${tour._id}`)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tour._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No packages found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TourPackages;



