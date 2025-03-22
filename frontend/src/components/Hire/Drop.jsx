import { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

import { Link } from "react-router-dom";


const vehicles = [
  { name: "Suzuki Alto", passengers: 3, baggage: "Limited" },
  { name: "Toyota Prius", passengers: 4, baggage: "Medium" },
  { name: "Honda Fit Shuttle", passengers: 4, baggage: "Large" },
];

export default function Drop() {
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    <div >
      <div >
        <h2 className="text-xl font-semibold text-center mb-4">Airport Drop</h2>

        <form className="space-y-4">
          {/* Vehicle Selection */}
          <label className="block text-gray-700 font-semibold">Select a Vehicle</label>
          <div className="flex space-x-4">
            {vehicles.map((vehicle, index) => (
              <button
                key={index}
                type="button"
                className={`py-2 px-4 border rounded-lg transition-all duration-300 ${
                  selectedCar === vehicle ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedCar(vehicle)}
              >
                {vehicle.name}
              </button>
            ))}
          </div>

          {/* Selected Vehicle Details */}
          {selectedCar && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold">{selectedCar.name}</h3>
              <p><strong>Passengers:</strong> {selectedCar.passengers}</p>
              <p><strong>Baggage:</strong> {selectedCar.baggage}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <label className="block text-gray-700 font-semibold">Pickup Location</label>
            <div className="flex items-center border p-2 rounded-lg bg-gray-50">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <input type="text" className="w-full bg-transparent outline-none" placeholder="Enter Pickup Location" />
            </div>

            <label className="block text-gray-700 font-semibold">Drop Location</label>
            <div className="flex items-center border p-2 rounded-lg bg-gray-50">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <input type="text" className="w-full bg-transparent outline-none" placeholder="BIA Departure Terminal, Katunayake" />
            </div>

            <label className="block text-gray-700 font-semibold">Date & Time</label>
            <div className="flex items-center border p-2 rounded-lg bg-gray-50">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <input type="datetime-local" className="w-full bg-transparent outline-none" />
            </div>
          </div>

          {/* Submit Button */}
          <Link to='userdetail'>
          <button type="submit" className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
            Book Now
          </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
