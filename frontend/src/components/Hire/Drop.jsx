import { useEffect, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Drop() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch vehicles from the backend
    axios.get("/api/v1/vehicles").then((response) => {
      setVehicles(response.data.data.vehicles);
    });
  }, []);

  // Function to handle Date & Time validation
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    // Check if the selected date is in the future
    if (selectedDate <= currentDate) {
      setError("Please select a future date and time.");
    } else {
      setError(""); // Clear error if date is valid
    }
    setDateTime(e.target.value);
  };

  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold text-center mb-4">Airport Drop</h2>

        <form className="space-y-4">
          {/* Vehicle Selection */}
          <label className="block text-gray-700 font-semibold">Select a Vehicle</label>
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedVehicle === vehicle._id ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
                onClick={() => setSelectedVehicle(vehicle._id)}
              >
                <h3 className="font-semibold">{vehicle.name}</h3>
                <p>Passengers: {vehicle.passengers}</p>
                <p>Baggage: {vehicle.baggage}</p>
              </div>
            ))}
          </div>

          {/* Selected Vehicle Details */}
          {selectedVehicle && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 text-black">
              <h3 className="text-lg font-semibold">
                {vehicles.find((vehicle) => vehicle._id === selectedVehicle)?.name}
              </h3>
              <p>
                <strong>Passengers:</strong>{" "}
                {vehicles.find((vehicle) => vehicle._id === selectedVehicle)?.passengers}
              </p>
              <p>
                <strong>Baggage:</strong>{" "}
                {vehicles.find((vehicle) => vehicle._id === selectedVehicle)?.baggage}
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <label className="block text-gray-700 font-semibold">
              Pickup Location <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border p-2 rounded-lg bg-gray-50">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-black"
                placeholder="Enter Pickup Location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
              />
            </div>

            <label className="block text-gray-700 font-semibold">Drop Location</label>
            <div className="flex items-center border p-2 rounded-lg bg-gray-50">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-black"
                value="BIA Departure Terminal, Katunayake"
                readOnly
              />
            </div>

            <label className="block text-gray-700 font-semibold">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border p-2 rounded-lg bg-gray-50">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <input
                type="datetime-local"
                className="w-full bg-transparent outline-none text-black"
                value={dateTime}
                onChange={handleDateChange}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display Error */}
          </div>

          {/* Submit Button */}
          <Link to="userdetail">
            <button
              type="submit"
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              disabled={!pickupLocation || !dateTime || error} // Disable if there's an error
            >
              Book Now
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
