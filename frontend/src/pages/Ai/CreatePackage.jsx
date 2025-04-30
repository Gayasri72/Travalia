import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';

const CreatePackage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numPeople, setNumPeople] = useState(1);
  const [interests, setInterests] = useState(['beach']);
  const [showModal, setShowModal] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setItinerary(null);
    try {
      const res = await axios.post('/api/itineraries/generate', {
        interests,
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        numPeople: numPeople,
      });
      setItinerary(res.data);
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 mt-6 mb-10">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Plan Your Trip</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Interests</label>
          <input
            type="text"
            value={interests.join(', ')}
            onChange={(e) =>
              setInterests(
                e.target.value
                  .split(',')
                  .map((i) => i.trim())
                  .filter(Boolean),
              )
            }
            className="w-full p-2 border rounded-lg"
            placeholder="e.g. beach, adventure"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              className="w-full p-2 border rounded-lg"
              placeholderText="Start Date"
              minDate={new Date()}
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              className="w-full p-2 border rounded-lg"
              placeholderText="End Date"
              minDate={startDate}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Number of People</label>
          <input
            type="number"
            min={1}
            max={20}
            value={numPeople}
            onChange={(e) => setNumPeople(Number(e.target.value))}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            handleSubmit();
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg w-full"
          disabled={
            !currentUser ||
            !startDate ||
            !endDate ||
            !numPeople ||
            interests.length === 0
          }
        >
          Generate Itinerary
        </button>
        {!currentUser && (
          <p className="text-red-500 text-center mt-2">
            You must be signed in to generate an itinerary.
          </p>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">
              Your AI-Generated Trip Plan
            </h2>
            {loading && <p>Generating itinerary...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && itinerary && (
              <div>
                <p>
                  <strong>Starting Point:</strong> {itinerary.startingPoint}
                </p>
                <p>
                  <strong>Total Days:</strong> {itinerary.totalDays}
                </p>
                <p>
                  <strong>Total Distance:</strong> {itinerary.totalDistance} km
                </p>
                <p>
                  <strong>Travel Mode:</strong> {itinerary.travelMode}
                </p>
                <p>
                  <strong>Estimated Fuel Cost:</strong> Rs{' '}
                  {itinerary.totalFuelCost}
                </p>
                <p>
                  <strong>Estimated Ticket Cost:</strong> Rs{' '}
                  {itinerary.totalCost}
                </p>
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Itinerary:</h3>
                  <ul className="max-h-60 overflow-y-auto">
                    {itinerary.itinerary.map((day) => (
                      <li key={day.day} className="mb-2">
                        <span className="font-semibold">Day {day.day}:</span>
                        <ul className="ml-4 list-disc">
                          {day.activities.map((act, idx) => (
                            <li key={idx} className="mb-3">
                              <div className="border rounded p-2 mb-1 bg-gray-50">
                                <div className="font-semibold text-blue-800">
                                  {act.name} ({act.region})
                                </div>
                                <div className="text-sm text-gray-700">
                                  <div>Category: {act.category}</div>
                                  <div>Type: {act.activityType}</div>
                                  <div>Rating: {act.rating}</div>
                                  <div>
                                    Tags: {act.tags && act.tags.join(', ')}
                                  </div>
                                  <div>Avg Time: {act.avgTime} hrs</div>
                                  <div>
                                    Avg Ticket Price: Rs {act.avgTicketPrice}
                                  </div>
                                </div>
                                {act.replacedDueToRain && (
                                  <div className="text-yellow-600 text-xs mt-1">
                                    (Replaced due to rain)
                                  </div>
                                )}
                                {act.indoorSuggestion && (
                                  <div className="mt-2 p-2 border rounded bg-blue-50">
                                    <div className="font-semibold text-blue-600">
                                      Indoor Suggestion:{' '}
                                      {act.indoorSuggestion.name} (
                                      {act.indoorSuggestion.region})
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      <div>
                                        Category:{' '}
                                        {act.indoorSuggestion.category}
                                      </div>
                                      <div>
                                        Type:{' '}
                                        {act.indoorSuggestion.activityType}
                                      </div>
                                      <div>
                                        Rating: {act.indoorSuggestion.rating}
                                      </div>
                                      <div>
                                        Tags:{' '}
                                        {act.indoorSuggestion.tags &&
                                          act.indoorSuggestion.tags.join(', ')}
                                      </div>
                                      <div>
                                        Avg Time: {act.indoorSuggestion.avgTime}{' '}
                                        hrs
                                      </div>
                                      <div>
                                        Avg Ticket Price: Rs{' '}
                                        {act.indoorSuggestion.avgTicketPrice}
                                      </div>
                                      {act.indoorSuggestion
                                        .suggestedDueToRain && (
                                        <div className="text-blue-500 text-xs mt-1">
                                          (Suggested due to rain)
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {!loading && !itinerary && !error && (
              <p>Fill the form and submit to get your itinerary.</p>
            )}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
              >
                Edit
              </button>
              <Link
                to="/"
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Confirm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePackage;
