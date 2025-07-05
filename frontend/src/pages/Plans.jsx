import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCar,
  FaGasPump,
  FaTicketAlt,
  FaTrashAlt,
  FaTimesCircle,
  FaWhatsapp,
} from 'react-icons/fa';

// Helper function to format plan for WhatsApp sharing
const getPlanShareText = (plan) => {
  let text = `My Travel Plan 🚗\n`;
  text += `From: ${plan.startDate?.slice(0, 10)} To: ${plan.endDate?.slice(0, 10)}\n`;
  text += `Starting Point: ${plan.startingPoint}\n`;
  text += `Total Days: ${plan.totalDays}\n`;
  text += `Travel Mode: ${plan.travelMode}\n`;
  text += `Distance: ${plan.totalDistance} km\n`;
  text += `Fuel Cost: Rs ${plan.totalFuelCost}\n`;
  text += `Tickets: Rs ${plan.totalCost}\n\n`;
  text += `Day-by-Day Itinerary:\n`;
  plan.itinerary.forEach((day) => {
    text += `Day ${day.day}:\n`;
    day.activities.forEach((act) => {
      text += `- ${act.name} (${act.region})\n`;
    });
  });
  return encodeURIComponent(text);
};

const API_URL = import.meta.env.VITE_API_URL;

function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/itineraries/user`, {
          credentials: 'include', // send cookies for auth
        });
        const data = await res.json();
        if (data.success) {
          setPlans(data.data);
        } else {
          setError('Failed to fetch plans');
        }
      } catch (err) {
        setError('Error fetching plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Delete plan function
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/itineraries/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setPlans((prev) => prev.filter((plan) => plan._id !== id));
        toast.success('Plan deleted successfully!');
      } else {
        toast.error('Failed to delete plan');
      }
    } catch (err) {
      toast.error('Error deleting plan');
    }
    setShowModal(false);
    setSelectedPlanId(null);
  };

  const openDeleteModal = (id) => {
    setSelectedPlanId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlanId(null);
    toast.info('Plan deletion cancelled');
  };

  const openDetailsModal = (plan) => {
    setSelectedPlan(plan);
    setDetailsModalOpen(true);
  };
  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedPlan(null);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-6"></div>
        <span className="text-blue-700 font-semibold text-lg">
          Loading your plans...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-8 text-red-500 font-semibold">{error}</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10">
      {/* Modal for delete confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-all">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md min-h-[220px] flex flex-col items-center animate-fade-in border-t-8 border-red-400">
            <FaTimesCircle className="text-red-400 text-5xl mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Delete Plan?
            </h2>
            <p className="mb-8 text-gray-600 text-center">
              Are you sure you want to delete this plan? This action cannot be
              undone.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold transition border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedPlanId)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-semibold transition flex items-center justify-center gap-2 shadow"
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for plan details */}
      {detailsModalOpen && selectedPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-all">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl min-h-[220px] flex flex-col animate-fade-in overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-800">Plan Details</h2>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-red-500 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-blue-800 text-lg font-semibold">
                <FaCalendarAlt className="text-blue-500" />
                {selectedPlan.startDate?.slice(0, 10)}
                <span className="mx-2 text-gray-300">→</span>
                {selectedPlan.endDate?.slice(0, 10)}
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-base">
                <FaMapMarkerAlt className="text-blue-400" />
                <span className="font-medium">
                  {selectedPlan.startingPoint}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="flex flex-col items-center bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                <FaCalendarAlt className="text-blue-500 mb-1 text-xl" />
                <span className="font-semibold text-blue-900">
                  {selectedPlan.totalDays}
                </span>
                <span className="text-xs text-gray-500">Days</span>
              </div>
              <div className="flex flex-col items-center bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                <FaCar className="text-blue-500 mb-1 text-xl" />
                <span className="font-semibold text-blue-900">
                  {selectedPlan.travelMode}
                </span>
                <span className="text-xs text-gray-500">Travel Mode</span>
              </div>
              <div className="flex flex-col items-center bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                <FaMapMarkerAlt className="text-blue-500 mb-1 text-xl" />
                <span className="font-semibold text-blue-900">
                  {selectedPlan.totalDistance}
                </span>
                <span className="text-xs text-gray-500">Distance (km)</span>
              </div>
              <div className="flex flex-col items-center bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                <FaGasPump className="text-blue-500 mb-1 text-xl" />
                <span className="font-semibold text-blue-900">
                  Rs {selectedPlan.totalFuelCost}
                </span>
                <span className="text-xs text-gray-500">Fuel</span>
              </div>
              <div className="flex flex-col items-center bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                <FaTicketAlt className="text-blue-500 mb-1 text-xl" />
                <span className="font-semibold text-blue-900">
                  Rs {selectedPlan.totalCost}
                </span>
                <span className="text-xs text-gray-500">Tickets</span>
              </div>
            </div>
            <div className="mt-2">
              <h3 className="font-bold text-blue-700 mb-3 text-lg flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" /> Day-by-Day Itinerary
              </h3>
              <ul className="space-y-4">
                {selectedPlan.itinerary.map((day) => (
                  <li
                    key={day.day}
                    className="bg-blue-50 border-l-4 border-blue-600 rounded-xl shadow p-4"
                  >
                    <div className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                      Day {day.day}
                    </div>
                    <ul className="ml-4 list-disc text-gray-700">
                      {day.activities.map((act, i) => (
                        <li key={i} className="mb-1">
                          <span className="font-medium">{act.name}</span>{' '}
                          <span className="text-xs text-gray-500">
                            ({act.region})
                          </span>
                          {act.indoorSuggestion && (
                            <span className="text-blue-600 ml-2 text-xs">
                              (Indoor: {act.indoorSuggestion.name})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-blue-900 tracking-tight drop-shadow-lg font-serif italic">
        My Travel Plans
      </h1>
      {plans.length === 0 ? (
        <div className="text-center text-gray-400 text-lg py-20">
          No plans found. Start planning your next adventure!
        </div>
      ) : (
        <div className="grid gap-10">
          {plans.map((plan, idx) => (
            <div
              key={plan._id || idx}
              className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transition-shadow relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-200 rounded-t-3xl" />
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 text-blue-800 text-lg font-semibold">
                  <FaCalendarAlt className="text-blue-500" />
                  {plan.startDate?.slice(0, 10)}
                  <span className="mx-2 text-gray-300">→</span>
                  {plan.endDate?.slice(0, 10)}
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-base">
                  <FaMapMarkerAlt className="text-blue-400" />
                  <span className="font-medium">{plan.startingPoint}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="flex flex-col items-center bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                  <FaCalendarAlt className="text-blue-500 mb-1 text-xl" />
                  <span className="font-semibold text-blue-900">
                    {plan.totalDays}
                  </span>
                  <span className="text-xs text-gray-500">Days</span>
                </div>
                <div className="flex flex-col items-center bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                  <FaCar className="text-blue-500 mb-1 text-xl" />
                  <span className="font-semibold text-blue-900">
                    {plan.travelMode}
                  </span>
                  <span className="text-xs text-gray-500">Travel Mode</span>
                </div>
                <div className="flex flex-col items-center bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                  <FaMapMarkerAlt className="text-blue-500 mb-1 text-xl" />
                  <span className="font-semibold text-blue-900">
                    {plan.totalDistance}
                  </span>
                  <span className="text-xs text-gray-500">Distance (km)</span>
                </div>
                <div className="flex flex-col items-center bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                  <FaGasPump className="text-blue-500 mb-1 text-xl" />
                  <span className="font-semibold text-blue-900">
                    Rs {plan.totalFuelCost}
                  </span>
                  <span className="text-xs text-gray-500">Fuel</span>
                </div>
                <div className="flex flex-col items-center bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                  <FaTicketAlt className="text-blue-500 mb-1 text-xl" />
                  <span className="font-semibold text-blue-900">
                    Rs {plan.totalCost}
                  </span>
                  <span className="text-xs text-gray-500">Tickets</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => openDeleteModal(plan._id)}
                  className="bg-red-100 text-red-600 rounded-full p-2 shadow hover:bg-red-200 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-300"
                  title="Delete Plan"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                >
                  <FaTrashAlt />
                </button>
                <button
                  onClick={() => openDetailsModal(plan)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    const text = getPlanShareText(plan);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  className="px-6 py-2 bg-green-500 text-white rounded-full font-semibold shadow hover:bg-green-600 transition-all flex items-center gap-2"
                  title="Share to WhatsApp"
                >
                  <FaWhatsapp className="text-xl" /> Share
                </button>
                <Link
                  to="/contact"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Plans;
