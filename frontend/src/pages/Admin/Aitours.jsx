import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_URL = import.meta.env.VITE_API_URL;

function Aitours() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchAllPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/itineraries`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok || !data.data) throw new Error('Failed to fetch plans');
        setPlans(data.data);
      } catch (err) {
        setError(err.message || 'Error fetching plans');
      } finally {
        setLoading(false);
      }
    };
    fetchAllPlans();
  }, []);

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  // PDF Report Generation
  const handleDownloadReport = (plansToExport) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'A4',
    });
    doc.setFontSize(18);
    doc.text('All Plans Full Report', 40, 30);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 40, 45);
    const tableHead = [
      'No.',
      'User ID',
      'Trip Dates',
      'Starting Point',
      'Days',
      'Travel Mode',
      'Distance (km)',
      'Fuel Cost',
      'Ticket Cost',
      'Itinerary (Day/Activities)',
    ];
    const tableData = plansToExport.map((plan, idx) => [
      idx + 1,
      plan.user,
      `${plan.startDate?.slice(0, 10)} - ${plan.endDate?.slice(0, 10)}`,
      plan.startingPoint,
      plan.totalDays,
      plan.travelMode,
      plan.totalDistance,
      plan.totalFuelCost,
      plan.totalCost,
      plan.itinerary
        .map(
          (day) =>
            `Day ${day.day}: ` +
            day.activities
              .map(
                (act) =>
                  `${act.name} (${act.region})` +
                  (act.indoorSuggestion
                    ? ` [Indoor: ${act.indoorSuggestion.name}]`
                    : ''),
              )
              .join(', '),
        )
        .join(' | '),
    ]);
    autoTable(doc, {
      startY: 60,
      head: [tableHead],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellWidth: 'wrap' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10 },
      columnStyles: {
        9: { cellWidth: 300 }, // Make itinerary column wider
      },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          doc.internal.pageSize.getWidth() - 60,
          doc.internal.pageSize.getHeight() - 10,
        );
      },
    });
    doc.save('plans-full-report.pdf');
  };

  // Filtering logic
  const [filter, setFilter] = useState('all');
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const filteredPlans = plans.filter((plan) => {
    const created = new Date(plan.createdAt);
    if (filter === 'today') {
      return created >= startOfToday;
    } else if (filter === 'week') {
      return created >= startOfWeek;
    } else if (filter === 'month') {
      return created >= startOfMonth;
    }
    return true;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-lg font-semibold animate-pulse">
          Loading all plans...
        </span>
      </div>
    );
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <div className="flex flex-wrap gap-6 mb-10 items-center justify-between">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 drop-shadow flex-1">
          All Plans in Database
        </h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-lg font-semibold border ${filter === 'all' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border-blue-300'} transition`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('today')}
            className={`px-5 py-2 rounded-lg font-semibold border ${filter === 'today' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border-blue-300'} transition`}
          >
            Today
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-5 py-2 rounded-lg font-semibold border ${filter === 'week' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border-blue-300'} transition`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-5 py-2 rounded-lg font-semibold border ${filter === 'month' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border-blue-300'} transition`}
          >
            This Month
          </button>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white px-7 py-3 rounded-xl text-lg font-bold shadow-lg transition-all"
        >
          Download Report
        </button>
      </div>
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-8 relative border border-blue-100">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6 text-blue-700 text-center">
              Select Data Range
            </h2>
            <div className="flex flex-col gap-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() => {
                  handleDownloadReport(plans);
                  setShowReportModal(false);
                }}
              >
                All
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() => {
                  handleDownloadReport(
                    plans.filter(
                      (plan) => new Date(plan.createdAt) >= startOfToday,
                    ),
                  );
                  setShowReportModal(false);
                }}
              >
                Today
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() => {
                  handleDownloadReport(
                    plans.filter(
                      (plan) => new Date(plan.createdAt) >= startOfWeek,
                    ),
                  );
                  setShowReportModal(false);
                }}
              >
                This Week
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() => {
                  handleDownloadReport(
                    plans.filter(
                      (plan) => new Date(plan.createdAt) >= startOfMonth,
                    ),
                  );
                  setShowReportModal(false);
                }}
              >
                This Month
              </button>
            </div>
          </div>
        </div>
      )}
      {filteredPlans.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-20">
          No plans found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map((plan, idx) => (
            <div
              key={plan._id || idx}
              className="bg-white/90 rounded-2xl shadow-xl p-7 hover:scale-[1.02] transition-transform duration-200 border border-blue-100 flex flex-col justify-between min-h-[320px]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow">
                  {idx + 1}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-800">
                    Trip: {plan.startDate?.slice(0, 10)} -{' '}
                    {plan.endDate?.slice(0, 10)}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    User ID: <span className="font-mono">{plan.user}</span>
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-gray-700 mb-4">
                <p>
                  <span className="font-semibold">Starting Point:</span>{' '}
                  {plan.startingPoint}
                </p>
                <p>
                  <span className="font-semibold">Total Days:</span>{' '}
                  {plan.totalDays}
                </p>
                <p>
                  <span className="font-semibold">Travel Mode:</span>{' '}
                  {plan.travelMode}
                </p>
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => openModal(plan)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for full plan details */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10 relative overflow-y-auto max-h-[90vh] border border-blue-100">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2 text-blue-700">
              Trip Details
            </h2>
            <p className="mb-2">
              <strong>User ID:</strong>{' '}
              <span className="font-mono">{selectedPlan.user}</span>
            </p>
            <p className="mb-2">
              <strong>Trip Dates:</strong>{' '}
              {selectedPlan.startDate?.slice(0, 10)} -{' '}
              {selectedPlan.endDate?.slice(0, 10)}
            </p>
            <p className="mb-2">
              <strong>Starting Point:</strong> {selectedPlan.startingPoint}
            </p>
            <p className="mb-2">
              <strong>Total Days:</strong> {selectedPlan.totalDays}
            </p>
            <p className="mb-2">
              <strong>Total Distance:</strong> {selectedPlan.totalDistance} km
            </p>
            <p className="mb-2">
              <strong>Travel Mode:</strong> {selectedPlan.travelMode}
            </p>
            <p className="mb-2">
              <strong>Fuel Cost:</strong>{' '}
              <span className="text-green-700 font-bold">
                Rs {selectedPlan.totalFuelCost}
              </span>
            </p>
            <p className="mb-2">
              <strong>Ticket Cost:</strong>{' '}
              <span className="text-green-700 font-bold">
                Rs {selectedPlan.totalCost}
              </span>
            </p>
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-blue-700">Itinerary:</h3>
              <ol className="space-y-2 list-decimal ml-6">
                {selectedPlan.itinerary.map((day) => (
                  <li key={day.day} className="">
                    <span className="font-semibold text-blue-600">
                      Day {day.day}:
                    </span>
                    <ul className="ml-4 list-disc text-gray-700">
                      {day.activities.map((act, i) => (
                        <li key={i} className="mb-1">
                          <span className="font-medium">{act.name}</span>{' '}
                          <span className="text-xs text-gray-500">
                            ({act.region})
                          </span>
                          {act.indoorSuggestion && (
                            <span className="text-blue-500 ml-2 text-xs">
                              (Indoor: {act.indoorSuggestion.name})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Aitours;
