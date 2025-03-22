import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

const destinations = [
  { name: "Galle", province: "Southern", image: "/src/assets/ai/galle.jpg" },
  { name: "Kandy", province: "Central", image: "/src/assets/ai/kandy.jpg" },
  { name: "Ella", province: "Central", image: "/src/assets/ai/ella.jpg" },
  { name: "Colombo", province: "Western", image: "/src/assets/ai/colombo.jpg" },
  { name: "Polonnaruwa", province: "North Central", image: "/src/assets/ai/polonnaruwa.jpg" },
  { name: "Weligama", province: "Southern", image: "/src/assets/ai/weligama.jpg" },
];

const tripTypes = ["Solo", "Group", "Family"];
const activities = ["Adventure", "Relaxation", "Culture", "Food", "Shopping"];

const CreatePackage = () => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tripType, setTripType] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleActivityChange = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((item) => item !== activity)
        : [...prev, activity]
    );
  };

  const isDateValid = (date) => date >= new Date();
  const isEndDateValid = (date) => startDate && date >= startDate && (date - startDate) / (1000 * 60 * 60 * 24) <= 5;
  const tripDuration = startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="flex max-w-5xl mx-auto p-6 bg-gray-300 shadow-lg rounded-lg mt-10 mb-10">
      {/* Left Side: Form */}
      <div className="w-1/2 p-6 bg-white rounded-lg shadow-md">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Where do you want to go?</h2>
            <input
              type="text"
              placeholder="Choose a city or town"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <div className="grid grid-cols-3 gap-4 mt-4">
              {destinations.map((dest) => (
                <div
                  key={dest.name}
                  className="cursor-pointer border p-2 rounded-lg"
                  onClick={() => setDestination(dest.name)}
                >
                  <img src={dest.image} alt={dest.name} className="w-20 h-20 mx-auto rounded-lg" />
                  <p className="mt-2 font-semibold">{dest.name}</p>
                  <p className="text-sm text-gray-500">{dest.province}</p>
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
            <div className="flex gap-4">
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                className="w-full p-3 border rounded-lg text-center"
                placeholderText="Start Date"
                minDate={new Date()}
                filterDate={isDateValid}
              />
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                className="w-full p-3 border rounded-lg text-center"
                placeholderText="End Date"
                minDate={startDate}
                maxDate={startDate && new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000)}
                filterDate={isEndDateValid}
              />
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-2 bg-gray-300 rounded-lg">Back</button>
              <button
                onClick={() => setStep(3)}
                disabled={!startDate || !endDate}
                className={`px-6 py-2 text-white rounded-lg ${
                  startDate && endDate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
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
                    <button onClick={() => setShowModal(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                      Submit
                    </button>
                  </div>
                </div>
              )}
        
              {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                    <h2 className="text-xl font-bold mb-4">Review Your Trip Plan</h2>
                    <p><strong>Destination:</strong> {destination}</p>
                    <p><strong> Number Of Dates:</strong> { tripDuration}</p>

                    <p><strong>Trip Type:</strong> {tripType}</p>
                    <p><strong>Activities:</strong> {selectedActivities.join(", ") || "None"}</p>
                    <div className="mt-4 flex justify-between">
                      <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">
                        Edit
                      </button>
                      <Link to='/' className="px-4 py-2 bg-green-600 text-white rounded-lg">Confirm</Link>
                    </div>
                  </div>
                </div>
              )}
      </div>

      {/* Right Side: AI Description */}
      <div className="w-1/2 p-6 bg-gray-100 rounded-lg shadow-md ml-6">
        <h2 className="text-2xl font-bold mb-4">How AI-powered Tour Suggestion Works</h2>
        <p className="text-gray-700 mb-4">
          Our AI-powered system analyzes your preferences, such as travel destination, trip type,
          and interests, to generate a personalized tour itinerary.
        </p>
        <ul className="list-disc list-inside text-gray-600">
          <li>Recommends destinations based on your interests</li>
          <li>Suggests optimal travel dates and accommodations</li>
          <li>Curates activities that match your selected preferences</li>
          <li>Adapts plans based on real-time factors like weather</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatePackage;
