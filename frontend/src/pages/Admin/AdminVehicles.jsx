import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ name: "", passengers: "", baggage: "" });
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [editVehicleData, setEditVehicleData] = useState({ name: "", passengers: "", baggage: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/vehicles");
      setVehicles(response.data.data.vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Failed to fetch vehicles"); // Set error message
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!newVehicle.name || !newVehicle.passengers || !newVehicle.baggage) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("/api/v1/vehicles", newVehicle);
      setVehicles((prev) => [...prev, response.data.data.vehicle]);
      setNewVehicle({ name: "", passengers: "", baggage: "" });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle");
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`/api/v1/vehicles/${id}`);
      setVehicles((prev) => prev.filter((vehicle) => vehicle._id !== id));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle");
    }
  };

  const handleEditClick = (vehicle) => {
    setEditVehicleId(vehicle._id);
    setEditVehicleData({
      name: vehicle.name,
      passengers: vehicle.passengers,
      baggage: vehicle.baggage,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/v1/vehicles/${id}`, editVehicleData);
      setVehicles((prev) => prev.map((v) => (v._id === id ? response.data.data.vehicle : v)));
      setEditVehicleId(null);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      alert("Failed to update vehicle");
    }
  };

  const handleCancelEdit = () => {
    setEditVehicleId(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Vehicles</h2>

      {/* Add Vehicle Form */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Vehicle Name"
          value={newVehicle.name}
          onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
          className="border p-2 rounded-lg flex-1"
        />
        <input
          type="number"
          placeholder="Passengers"
          value={newVehicle.passengers}
          onChange={(e) => setNewVehicle({ ...newVehicle, passengers: e.target.value })}
          className="border p-2 rounded-lg flex-1"
        />
        <input
          type="text"
          placeholder="Baggage Capacity"
          value={newVehicle.baggage}
          onChange={(e) => setNewVehicle({ ...newVehicle, baggage: e.target.value })}
          className="border p-2 rounded-lg flex-1"
        />
        <button
          onClick={handleAddVehicle}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Vehicle
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Vehicles Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading vehicles...</p>
        ) : vehicles.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-6 text-left">Vehicle Name</th>
                <th className="py-3 px-6 text-left">Passengers</th>
                <th className="py-3 px-6 text-left">Baggage</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle._id} className="border-b">
                  {editVehicleId === vehicle._id ? (
                    <>
                      <td className="py-3 px-6">
                        <input
                          type="text"
                          name="name"
                          value={editVehicleData.name}
                          onChange={handleEditChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-3 px-6">
                        <input
                          type="number"
                          name="passengers"
                          value={editVehicleData.passengers}
                          onChange={handleEditChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-3 px-6">
                        <input
                          type="text"
                          name="baggage"
                          value={editVehicleData.baggage}
                          onChange={handleEditChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-3 px-6 space-x-2">
                        <button
                          onClick={() => handleSaveEdit(vehicle._id)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-6">{vehicle.name}</td>
                      <td className="py-3 px-6">{vehicle.passengers}</td>
                      <td className="py-3 px-6">{vehicle.baggage}</td>
                      <td className="py-3 px-6 space-x-2">
                        <button
                          onClick={() => handleEditClick(vehicle)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle._id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No vehicles found.</p>
        )}
      </div>
    </div>
  );
}
