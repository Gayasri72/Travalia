import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ name: "", passengers: 0, baggage: "" });

  useEffect(() => {
    // Fetch all vehicles
    axios.get("/api/v1/vehicles").then((response) => {
      setVehicles(response.data.data.vehicles);
    });
  }, []);

  const handleAddVehicle = () => {
    axios.post("/api/v1/vehicles", newVehicle).then((response) => {
      setVehicles([...vehicles, response.data.data.vehicle]);
      setNewVehicle({ name: "", passengers: 0, baggage: "" });
    });
  };

  const handleDeleteVehicle = (id) => {
    axios.delete(`/api/v1/vehicles/${id}`).then(() => {
      setVehicles(vehicles.filter((vehicle) => vehicle._id !== id));
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-center mb-4">Manage Vehicles</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Vehicle Name"
          value={newVehicle.name}
          onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
          className="border p-2 rounded-lg w-full"
        />
        <input
          type="number"
          placeholder="Passengers"
          value={newVehicle.passengers}
          onChange={(e) => setNewVehicle({ ...newVehicle, passengers: e.target.value })}
          className="border p-2 rounded-lg w-full"
        />
        <input
          type="text"
          placeholder="Baggage Capacity"
          value={newVehicle.baggage}
          onChange={(e) => setNewVehicle({ ...newVehicle, baggage: e.target.value })}
          className="border p-2 rounded-lg w-full"
        />
        <button
          onClick={handleAddVehicle}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Add Vehicle
        </button>
      </div>

      <ul className="mt-6 space-y-4">
        {vehicles.map((vehicle) => (
          <li key={vehicle._id} className="flex justify-between items-center border p-4 rounded-lg">
            <span>{vehicle.name} - {vehicle.passengers} Passengers - {vehicle.baggage} Baggage</span>
            <button
              onClick={() => handleDeleteVehicle(vehicle._id)}
              className="bg-red-500 text-white py-1 px-3 rounded-lg"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}