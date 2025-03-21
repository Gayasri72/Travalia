import { useState } from "react";
import Pickup from "../components/Hire/Pick";
import Drop from "../components/Hire/Drop";


export default function Hires() {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="relative bg-cover bg-center h-screen flex flex-col justify-center items-center text-blue-300 px-6"
      style={{ backgroundImage: "url('https://kangaroocabs.com/your-background-image.jpg')" }}>

      <h1 className="text-4xl font-bold text-center">
        Your Journey with Travelia Cabs<br />
        <span className="text-blue-600">Starts Here</span>
      </h1>
      <p className="text-lg mt-2">Your safety and comfort is our concern</p>

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
        <div className={`transition-opacity duration-500 transform ${activeForm ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden"}`}>
          {activeForm === "pickup" && <Pickup />}
          {activeForm === "drop" && <Drop />}
        </div>
      </div>
    </div>
  );
}
