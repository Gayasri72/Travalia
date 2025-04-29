import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:3000/api/itineraries/user', {
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
      const res = await fetch(`http://localhost:3000/api/itineraries/${id}`, {
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

  if (loading) return <div className="text-center mt-8">Loading plans...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Modal for delete confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 min-h-[200px] overflow-auto flex flex-col justify-between">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this plan?</p>
            <div className="flex flex-col gap-2 mt-auto">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 w-full"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedPlanId)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-center">My Plans</h1>
      {plans.length === 0 ? (
        <div className="text-center text-gray-500">No plans found.</div>
      ) : (
        plans.map((plan, idx) => (
          <div
            key={plan._id || idx}
            className="bg-white rounded-lg shadow-md p-4 mb-6"
          >
            <div className="flex justify-end mb-2 gap-2">
              <button
                onClick={() => openDeleteModal(plan._id)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
            <h2 className="text-xl font-bold mb-2">
              Trip from {plan.startDate?.slice(0, 10)} to{' '}
              {plan.endDate?.slice(0, 10)}
            </h2>
            <p>
              <strong>Starting Point:</strong> {plan.startingPoint}
            </p>
            <p>
              <strong>Total Days:</strong> {plan.totalDays}
            </p>
            <p>
              <strong>Total Distance:</strong> {plan.totalDistance} km
            </p>
            <p>
              <strong>Travel Mode:</strong> {plan.travelMode}
            </p>
            <p>
              <strong>Estimated Fuel Cost:</strong> Rs {plan.totalFuelCost}
            </p>
            <p>
              <strong>Estimated Ticket Cost:</strong> Rs {plan.totalCost}
            </p>
            <div className="mt-2">
              <h3 className="font-semibold mb-1">Itinerary:</h3>
              <ul>
                {plan.itinerary.map((day) => (
                  <li key={day.day} className="mb-1">
                    <span className="font-semibold">Day {day.day}:</span>
                    <ul className="ml-4 list-disc">
                      {day.activities.map((act, i) => (
                        <li key={i}>
                          {act.name} ({act.region})
                          {act.indoorSuggestion && (
                            <span className="text-blue-600 ml-2">
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
        ))
      )}
    </div>
  );
}

export default Plans;
