import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie to handle cookies

export default function Drop() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("BIA Arrival Terminal, Katunayake, Sri Lanka");
  const [dateTime, setDateTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/v1/vehicles").then((response) => {
      setVehicles(response.data.data.vehicles);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const selectedDateTime = new Date(dateTime);
    const currentDateTime = new Date();
    if (selectedDateTime < currentDateTime) {
      alert("Please select a future date and time.");
      return;
    }

    const selectedVehicleName = vehicles.find((v) => v._id === selectedVehicle)?.name;

    const formData = {
      customerName,
      email,
      phoneNo,
      pickupLocation,
      dropLocation,
      dateTime,
      vehicleName: selectedVehicleName || "", // Ensure vehicleName is included
    };

    try {
      const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
      console.log("Retrieved token from localStorage:", token); // Log the token for debugging

      if (!token) {
        console.error("No authentication token found. Please log in.");
        alert("You must be logged in to create a drop booking.");
        return;
      }

      const response = await axios.post("/api/drop/", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (response.status === 201) {
        alert("Booking request submitted successfully!");
        navigate("/"); // Navigate to home page after successful submission
      } else {
        console.error("Unexpected response status:", response.status);
        alert("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Unauthorized: Please log in again.");
        navigate("/sign-in"); // Redirect to login page
      } else {
        console.error("Error submitting booking request:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Failed to submit booking request. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-3 bg-gray-50 rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4 text-blue-500">Airport Drop</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-600">Select a Vehicle</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className={`p-3 border rounded-md cursor-pointer transition-all transform hover:scale-105 ${
                  selectedVehicle === vehicle._id ? "bg-blue-400 text-white" : "bg-gray-100"
                }`}
                onClick={() => setSelectedVehicle(vehicle._id)}
              >
                <h3 className="font-medium text-md">{vehicle.name}</h3>
                <p className="text-sm">Passengers: {vehicle.passengers}</p>
                <p className="text-sm">Baggage: {vehicle.baggage}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Pickup Location</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md bg-gray-100 text-gray-800"
            placeholder="Enter pickup location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
          />

          <label className="text-sm font-medium text-gray-600">Drop Location</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md bg-gray-100 text-gray-800"
            value="BIA Arrival Terminal, Katunayake, Sri Lanka"
            readOnly
            required
            onChange={(e) => setDropLocation(e.target.value)}
          />

          <label className="text-sm font-medium text-gray-600">Date & Time</label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded-md bg-gray-100 text-gray-800"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />

          <label className="text-sm font-medium text-gray-600">Customer Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md bg-gray-100 text-gray-800"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />

          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md bg-gray-100 text-gray-800"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="text-sm font-medium text-gray-600">Phone Number</label>
          <input
            type="tel"
            className="w-full p-2 border rounded-md bg-gray-100 text-gray-800"
            placeholder="Enter your phone number"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-md transition-all duration-200"
          disabled={!customerName || !email || !phoneNo || !pickupLocation || !dropLocation || !dateTime || !selectedVehicle}
        >
          Book Now
        </button>
      </form>
    </div>
  );
}
