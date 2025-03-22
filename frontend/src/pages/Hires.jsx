import { useState } from "react";
import Pickup from "../components/Hire/Pick";
import Drop from "../components/Hire/Drop";
import image from "../assets/hires/hire.jpg";

export default function Hires() {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Left Side - Background Image with Overlay */}
      <div
        className="hidden md:flex flex-1 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-4xl font-bold">Book Your Ride</h1>
          <p className="mt-4 text-lg">Experience the best travel service with us.</p>
        </div>
      </div>

      {/* Right Side - Booking Form */}
      <div
        className="flex flex-col justify-center items-center text-blue-300 px-6 w-full md:w-1/2 bg-cover bg-center h-screen"
        style={{ backgroundImage: "url('https://kangaroocabs.com/your-background-image.jpg')" }}
      >
        <h1 className="text-4xl font-bold text-center">
          Your Journey with <span className="text-blue-600">Travelia Cabs</span>
        </h1>
        <p className="text-lg mt-2">Your safety and comfort are our priority.</p>

        {/* Booking Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ${
              activeForm === "pickup" ? "scale-105" : ""
            }`}
            onClick={() => setActiveForm(activeForm === "pickup" ? null : "pickup")}
          >
            Airport Pickup
          </button>
          <button
            className={`bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ${
              activeForm === "drop" ? "scale-105" : ""
            }`}
            onClick={() => setActiveForm(activeForm === "drop" ? null : "drop")}
          >
            Airport Drop
          </button>
        </div>

        {/* Animated Form Section */}
        <div className="mt-6 w-full flex justify-center">
          {activeForm && (
            <div className="transition-opacity duration-500 transform opacity-100 scale-100">
              {activeForm === "pickup" && <Pickup />}
              {activeForm === "drop" && <Drop />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}