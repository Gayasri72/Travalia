import { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const vehicles = [
  { name: "Suzuki Alto", passengers: 3, baggage: "Limited" },
  { name: "Toyota Prius", passengers: 4, baggage: "Medium" },
  { name: "Honda Fit Shuttle", passengers: 4, baggage: "Large" },
];

export default function Pick() {
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    <div className="relative bg-cover bg-center h-screen flex flex-col justify-center items-center text-blue-300 px-6"
      style={{ backgroundImage: "url('https://kangaroocabs.com/your-background-image.jpg')" }}>
      
      <h1 className="text-4xl font-bold text-center">Your Journey with Travelia Cabs<br /><span className="text-blue-600">Starts Here</span></h1>
      <p className="text-lg mt-2">Your safety and comfort is our concern</p>
      
      <div className="mt-6 flex space-x-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Airport Pickup</button>
        <button className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg">Airport Drop</button>
      </div>
      
      <div className="mt-6 bg-blue-100 text-black p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold">Select a Vehicle</h2>
        <div className="flex space-x-4 mt-4">
          {vehicles.map((vehicle, index) => (
            <button 
              key={index} 
              className={`py-2 px-4 border rounded-lg  hover:bg-blue-800 ${selectedCar === vehicle ? 'bg-blue-500 text-white' : 'bg-blue-500'}`}
              onClick={() => setSelectedCar(vehicle)}>
              {vehicle.name}
            </button>
          ))}
        </div>
        {selectedCar && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold">{selectedCar.name}</h3>
            <p><strong>Passengers:</strong> {selectedCar.passengers}</p>
            <p><strong>Baggage:</strong> {selectedCar.baggage}</p>
          </div>
        )}
        
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold">Pickup Location</label>
          <div className="flex items-center border p-2 rounded-lg">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <input type="text" className="w-full outline-none" placeholder="BIA Arrival Terminal, Katunayake" />
          </div>
          
          <label className="block text-gray-700 font-semibold mt-4">Drop Location</label>
          <div className="flex items-center border p-2 rounded-lg">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <input type="text" className="w-full outline-none" placeholder="Enter Drop Location" />
          </div>
          
          <label className="block text-gray-700 font-semibold mt-4">Date & Time</label>
          <div className="flex items-center border p-2 rounded-lg">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <input type="datetime-local" className="w-full outline-none" />
          </div>
          
          <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}