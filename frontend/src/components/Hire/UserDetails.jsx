import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaDollarSign } from "react-icons/fa";

export default function BookingForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    passengerName: "",
    email: "",
    phone: "",
  });

  // Fake price generation (random between LKR 5000 - 15000)
  const fakePrice = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/summary", { state: { formData, fakePrice } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-cyan-400">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Booking Form
        </h2>

        {/* Passenger Name Input */}
        <label className="block text-gray-700 font-semibold mt-4">
          Passenger Name
        </label>
        <div className="flex items-center border border-gray-300 p-2 rounded-lg focus-within:border-blue-500">
          <FaUser className="text-gray-500 mr-2" />
          <input
            type="text"
            name="passengerName"
            value={formData.passengerName}
            onChange={handleChange}
            className="w-full outline-none"
            placeholder="Enter Name"
            required
          />
        </div>

        {/* Email Input */}
        <label className="block text-gray-700 font-semibold mt-4">Email</label>
        <div className="flex items-center border border-gray-300 p-2 rounded-lg focus-within:border-blue-500">
          <FaEnvelope className="text-gray-500 mr-2" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full outline-none"
            placeholder="Enter Email"
            required
          />
        </div>

        {/* Phone Number Input */}
        <label className="block text-gray-700 font-semibold mt-4">
          Phone Number
        </label>
        <div className="flex items-center border border-gray-300 p-2 rounded-lg focus-within:border-blue-500">
          <FaPhone className="text-gray-500 mr-2" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full outline-none"
            placeholder="Enter Phone"
            required
          />
        </div>

        {/* Estimated Price Display */}
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mt-4">
          <span className="text-gray-700 font-semibold">Estimated Price:</span>
          <span className="text-lg text-green-600 font-bold flex items-center">
            <FaDollarSign className="mr-1" /> LKR {fakePrice}
          </span>
        </div>

        {/* Book Now Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
        >
          Book Now
        </button>
      </form>
    </div>
  );
}
