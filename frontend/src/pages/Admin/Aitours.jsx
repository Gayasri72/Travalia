import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Aitours() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3000/api/itineraries', {
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
  const handleDownloadReport = () => {
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
    const tableData = plans.map((plan, idx) => [
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 drop-shadow">
          All Plans in Database
        </h1>
        <button
          onClick={handleDownloadReport}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
        >
          Download Report
        </button>
      </div>
      {plans.length === 0 ? (
        <div className="text-center text-gray-500">No plans found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={plan._id || idx}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow">
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
              <div className="space-y-1 text-gray-700">
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
                <button
                  onClick={() => openModal(plan)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
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
