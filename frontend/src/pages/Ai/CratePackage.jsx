import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const destinations = [
  { name: "London", country: "United Kingdom", image: "/images/london.jpg" },
  { name: "Key West", country: "United States", image: "/images/keywest.jpg" },
  { name: "Las Vegas", country: "United States", image: "/images/vegas.jpg" },
  { name: "New York City", country: "United States", image: "/images/nyc.jpg" },
  { name: "Cancun", country: "Mexico", image: "/images/cancun.jpg" },
  { name: "Belek", country: "Türkiye", image: "/images/belek.jpg" },
];

const tripTypes = ["Solo", "Group", "Family"];
const activities = ["Adventure", "Relaxation", "Culture", "Food", "Shopping"];

const CreatePackage = () => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState(null);
  const [tripType, setTripType] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleActivityChange = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((item) => item !== activity)
        : [...prev, activity]
    );
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg text-center mt-10">
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">First, where do you want to go?</h2>
          <p className="text-gray-500 mb-6">Choose a city or town</p>
          <input
            type="text"
            placeholder="Choose a city or town"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <p className="mt-4 font-semibold">Or get started with a popular destination</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {destinations.map((dest) => (
              <div
                key={dest.name}
                className="cursor-pointer border p-2 rounded-lg"
                onClick={() => setDestination(dest.name)}
              >
                <img src={dest.image} alt={dest.name} className="w-20 h-20 mx-auto rounded-lg" />
                <p className="mt-2 font-semibold">{dest.name}</p>
                <p className="text-sm text-gray-500">{dest.country}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!destination}
            className={`mt-6 px-6 py-2 text-white rounded-lg ${
              destination ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Select your travel dates</h2>
          <DatePicker
            selected={dates}
            onChange={(date) => setDates(date)}
            className="w-full p-3 border rounded-lg text-center"
            placeholderText="Pick a date"
          />
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(1)} className="px-6 py-2 bg-gray-300 rounded-lg">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!dates}
              className={`px-6 py-2 text-white rounded-lg ${
                dates ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">What kind of trip is this?</h2>
          <div className="flex flex-col gap-3 mt-4">
            {tripTypes.map((type) => (
              <button
                key={type}
                className={`p-3 rounded-lg ${
                  tripType === type ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setTripType(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(2)} className="px-6 py-2 bg-gray-300 rounded-lg">
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!tripType}
              className={`px-6 py-2 text-white rounded-lg ${
                tripType ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">What interests you?</h2>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {activities.map((activity) => (
              <label
                key={activity}
                className={`p-3 border rounded-lg cursor-pointer ${
                  selectedActivities.includes(activity) ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedActivities.includes(activity)}
                  onChange={() => handleActivityChange(activity)}
                />
                {activity}
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(3)} className="px-6 py-2 bg-gray-300 rounded-lg">
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Ready to Submit?</h2>
          <p className="text-gray-500">Review your choices and submit your trip plan.</p>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(4)} className="px-6 py-2 bg-gray-300 rounded-lg">
              Back
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePackage;
