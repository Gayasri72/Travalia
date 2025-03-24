import { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const vehicles = [
  { name: "Suzuki Alto", passengers: 3, baggage: "Limited" },
  { name: "Toyota Prius", passengers: 4, baggage: "Medium" },
  { name: "Honda Fit Shuttle", passengers: 4, baggage: "Large" },
];

export default function Pick() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [dropLocation, setDropLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [error, setError] = useState("");

  // Function to handle date validation
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
        <h2 className="text-xl font-semibold text-center mb-4">Airport Pickup</h2>

        <form className="space-y-4">
          {/* Vehicle Selection */}
          <label className="block text-gray-700 font-semibold">Select a Vehicle</label>
          <div className="flex space-x-4">
            {vehicles.map((vehicle, index) => (
              <button
                key={index}
                type="button"
                className={`py-2 px-4 border rounded-lg transition-all duration-300 ${
                  selectedCar === vehicle ? "bg-blue-500 text-white" : "bg-gray-700   text-white"
                }`}
                onClick={() => setSelectedCar(vehicle)}
              >
                {vehicle.name}
              </button>
            ))}
          </div>

          {/* Selected Vehicle Details */}
          {selectedCar && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-100 text-black">
              <h3 className="text-lg font-semibold ">{selectedCar.name}</h3>
              <p><strong>Passengers:</strong> {selectedCar.passengers}</p>
              <p><strong>Baggage:</strong> {selectedCar.baggage}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <label className="block text-gray-700 font-semibold">Drop Location <span className="text-red-500">*</span></label>
            <div className="flex items-center border p-2 rounded-lg bg-gray-50">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <input 
                type="text" 
                className="w-full bg-transparent outline-none text-black" 
                placeholder="Enter Drop Location"
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                required
              />
            </div>

            <label className="block text-gray-700 font-semibold">Pick Up Location</label>
            <div className="flex items-center border p-2 rounded-lg bg-gray-50">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <input 
                type="text" 
                className="w-full bg-transparent outline-none text-black" 
                value="BIA Departure Terminal, Katunayake"
                readOnly
              />
            </div>

            <label className="block text-gray-700 font-semibold">Date & Time <span className="text-red-500">*</span></label>
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
              disabled={!dropLocation || !dateTime || error} // Disable if there's an error
            >
              Book Now
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
