import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import {
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaMapMarkedAlt,
  FaUtensils,
  FaUmbrellaBeach,
  FaTree,
  FaLandmark,
  FaShoppingBag,
  FaCity,
  FaMountain,
  FaPaw,
  FaPalette,
  FaBolt,
} from 'react-icons/fa';

const INTERESTS = [
  { key: 'historical', label: 'Historical', icon: <FaLandmark /> },
  { key: 'adventure', label: 'Adventure', icon: <FaBolt /> },
  { key: 'beach', label: 'Beach', icon: <FaUmbrellaBeach /> },
  { key: 'nature', label: 'Nature', icon: <FaTree /> },
  { key: 'cultural', label: 'Cultural', icon: <FaPalette /> },
  { key: 'wildlife', label: 'Wildlife', icon: <FaPaw /> },
  { key: 'scenic', label: 'Scenic', icon: <FaMountain /> },
  { key: 'shopping', label: 'Shopping', icon: <FaShoppingBag /> },
  { key: 'modern', label: 'Modern', icon: <FaCity /> },
  { key: 'urban', label: 'Urban', icon: <FaCity /> },
  { key: 'food', label: 'Food', icon: <FaUtensils /> },
];

const CreatePackage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numPeople, setNumPeople] = useState(1);
  const [interests, setInterests] = useState(['beach']);
  const [showModal, setShowModal] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [confirmedItinerary, setConfirmedItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleEndDateChange = (date) => {
    if (startDate) {
      const maxEndDate = new Date(startDate);
      maxEndDate.setDate(maxEndDate.getDate() + 3); // 4 days including start
      if (date > maxEndDate) {
        setEndDate(maxEndDate);
      } else {
        setEndDate(date);
      }
    } else {
      setEndDate(date);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    // Only show the latest itinerary
    setItinerary(null);
    try {
      const res = await axios.post('/api/itineraries/generate', {
        interests,
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        numPeople: numPeople,
      });
      setItinerary(res.data); // Only set the latest
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-5xl bg-white/90 rounded-3xl shadow-2xl border border-gray-100 p-0 md:p-10 relative overflow-hidden animate-fade-in flex flex-col md:flex-row gap-0 md:gap-8">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-100/30 to-blue-200/10" />
        {/* Left: Form */}
        <div className="relative z-10 flex-1 md:max-w-[55%] p-6 md:p-0">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-blue-800 drop-shadow flex items-center justify-center gap-3">
            <FaMapMarkedAlt className="text-blue-500" />
            Create Your Custom Package
          </h1>
          <form
            className="space-y-10"
            onSubmit={async (e) => {
              e.preventDefault();
              if (isEditing) {
                setIsEditing(false);
                setShowModal(true);
                setLoading(true);
                setError('');
                setItinerary(null);
                await handleSubmit();
                setLoading(false);
              } else {
                setShowModal(true);
                setLoading(true);
                setError('');
                setItinerary(null);
                await handleSubmit();
                setLoading(false);
              }
            }}
          >
            {/* Interests as Chips */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                <FaCheckCircle className="text-blue-400" />
                Select Your Interests
              </h2>
              <div className="flex flex-wrap gap-3 mb-2">
                {INTERESTS.map(({ key, label, icon }) => (
                  <button
                    type="button"
                    key={key}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      interests.includes(key)
                        ? 'bg-blue-600 text-white border-blue-600 scale-105'
                        : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={() =>
                      interests.includes(key)
                        ? setInterests(interests.filter((i) => i !== key))
                        : setInterests([...interests, key])
                    }
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
              {interests.length === 0 && (
                <p className="text-red-500 text-sm">
                  Select at least one interest.
                </p>
              )}
            </section>
            {/* Dates & People */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-400" /> Start Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                  placeholderText="Start Date"
                  minDate={new Date()}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-400" /> End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                  placeholderText="End Date"
                  minDate={startDate}
                  maxDate={
                    startDate
                      ? new Date(
                          new Date(startDate).setDate(
                            new Date(startDate).getDate() + 3,
                          ),
                        )
                      : null
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 flex items-center gap-2">
                  <FaUsers className="text-blue-400" /> Number of People
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={numPeople}
                  onChange={(e) => setNumPeople(Number(e.target.value))}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </section>
            <div className="flex justify-end">
              <button
                type="submit"
                className="fixed md:static bottom-8 right-8 z-50 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white px-10 py-4 rounded-full text-lg font-bold shadow-2xl transition-all flex items-center gap-3 animate-bounce-in disabled:opacity-50"
                disabled={
                  !currentUser ||
                  !startDate ||
                  !endDate ||
                  !numPeople ||
                  interests.length === 0
                }
              >
                <FaMapMarkedAlt className="text-xl" />
                Generate Itinerary
              </button>
            </div>
          </form>
        </div>
        {/* Right: How Itinerary Works */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-blue-100/60 to-blue-200/30 rounded-2xl p-6 md:p-10 shadow-lg border border-blue-100 mt-8 md:mt-0">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-blue-400" /> How Itinerary Generation
            Works
          </h2>
          <ul className="space-y-6 w-full max-w-md">
            <li className="flex items-start gap-4">
              <span className="bg-blue-100 text-blue-700 rounded-full p-3 text-xl shadow">
                <FaCheckCircle />
              </span>
              <div>
                <span className="font-semibold text-blue-800">
                  Personalized Selection:
                </span>
                <p className="text-gray-700 text-sm">
                  Choose your interests, dates, and group size. Our AI tailors
                  the trip to your preferences.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="bg-blue-100 text-blue-700 rounded-full p-3 text-xl shadow">
                <FaMapMarkedAlt />
              </span>
              <div>
                <span className="font-semibold text-blue-800">
                  Smart Planning:
                </span>
                <p className="text-gray-700 text-sm">
                  We optimize routes, suggest top attractions, and balance your
                  days for the best experience.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="bg-blue-100 text-blue-700 rounded-full p-3 text-xl shadow">
                <FaCalendarAlt />
              </span>
              <div>
                <span className="font-semibold text-blue-800">
                  Day-by-Day Schedule:
                </span>
                <p className="text-gray-700 text-sm">
                  Get a detailed daily plan with activities, travel times, and
                  recommendations.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="bg-blue-100 text-blue-700 rounded-full p-3 text-xl shadow">
                <FaUsers />
              </span>
              <div>
                <span className="font-semibold text-blue-800">
                  Easy to Edit & Share:
                </span>
                <p className="text-gray-700 text-sm">
                  Review, customize, and share your itinerary with your travel
                  group instantly.
                </p>
              </div>
            </li>
          </ul>
          <div className="mt-8 w-full flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg mb-2 animate-pulse">
              <FaMapMarkedAlt className="text-white text-4xl" />
            </div>
            <span className="text-blue-700 font-semibold text-lg">
              Start building your dream trip!
            </span>
          </div>
        </div>
      </div>
      {/* Modal remains unchanged */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
          <div className="bg-white p-0 rounded-3xl shadow-2xl max-w-3xl w-full relative animate-fade-in overflow-y-auto max-h-[92vh] border border-blue-200 flex flex-col">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold z-10 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-150"
              aria-label="Close"
            >
              ×
            </button>
            <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-t-3xl px-10 py-8 flex items-center gap-5 shadow-md border-b border-blue-200">
              <FaMapMarkedAlt className="text-white text-4xl drop-shadow-lg" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">
                Your AI-Generated Trip Plan
              </h2>
            </div>
            <div className="px-10 py-8 flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-white">
              {loading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-6"></div>
                  <div className="text-blue-700 font-semibold text-xl">
                    Generating itinerary...
                  </div>
                </div>
              )}
              {error && (
                <div className="text-red-500 font-semibold text-center py-10 text-lg">
                  {error}
                </div>
              )}
              {itinerary && !loading && !error && !confirmedItinerary && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
                      <span className="font-semibold text-blue-700">
                        Starting Point
                      </span>
                      <span className="text-lg font-bold text-blue-900">
                        {itinerary.startingPoint}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
                      <span className="font-semibold text-blue-700">
                        Total Days
                      </span>
                      <span className="text-lg font-bold text-blue-900">
                        {itinerary.totalDays}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
                      <span className="font-semibold text-blue-700">
                        Total Distance
                      </span>
                      <span className="text-lg font-bold text-blue-900">
                        {itinerary.totalDistance} km
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
                      <span className="font-semibold text-blue-700">
                        Travel Mode
                      </span>
                      <span className="text-lg font-bold text-blue-900">
                        {itinerary.travelMode}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
                      <span className="font-semibold text-blue-700">
                        Estimated Fuel Cost
                      </span>
                      <span className="text-lg font-bold text-blue-900">
                        Rs {itinerary.totalFuelCost}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
                      <span className="font-semibold text-blue-700">
                        Estimated Ticket Cost
                      </span>
                      <span className="text-lg font-bold text-blue-900">
                        Rs {itinerary.totalCost}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-bold text-blue-800 text-2xl mb-6 flex items-center gap-3">
                      <FaCalendarAlt className="text-blue-500" /> Day-by-Day
                      Itinerary
                    </h3>
                    <ul className="space-y-7 max-h-80 overflow-y-auto pr-2">
                      {itinerary.itinerary.map((day) => (
                        <li
                          key={day.day}
                          className="bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-5 hover:shadow-lg transition-all"
                        >
                          <div className="font-semibold text-blue-700 mb-3 text-lg flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-400" /> Day{' '}
                            {day.day}
                          </div>
                          <ul className="space-y-3 ml-2">
                            {day.activities.map((act, idx) => (
                              <li
                                key={idx}
                                className="bg-blue-50 rounded-lg p-4 border border-blue-100 hover:bg-blue-100 transition-all"
                              >
                                <div className="font-semibold text-blue-800 text-base flex items-center gap-2">
                                  <FaMapMarkedAlt className="text-blue-400" />{' '}
                                  {act.name}{' '}
                                  <span className="text-xs text-gray-500">
                                    ({act.region})
                                  </span>
                                </div>
                                <div className="text-sm text-gray-700 flex flex-wrap gap-4 mt-1">
                                  <span>
                                    Category:{' '}
                                    <span className="font-medium text-blue-700">
                                      {act.category}
                                    </span>
                                  </span>
                                  <span>
                                    Type:{' '}
                                    <span className="font-medium text-blue-700">
                                      {act.activityType}
                                    </span>
                                  </span>
                                  <span>
                                    Rating:{' '}
                                    <span className="font-medium text-blue-700">
                                      {act.rating}
                                    </span>
                                  </span>
                                  <span>
                                    Tags:{' '}
                                    <span className="font-medium text-blue-700">
                                      {act.tags && act.tags.join(', ')}
                                    </span>
                                  </span>
                                  <span>
                                    Avg Time:{' '}
                                    <span className="font-medium text-blue-700">
                                      {act.avgTime} hrs
                                    </span>
                                  </span>
                                  <span>
                                    Avg Ticket:{' '}
                                    <span className="font-medium text-blue-700">
                                      Rs {act.avgTicketPrice}
                                    </span>
                                  </span>
                                </div>
                                {act.replacedDueToRain && (
                                  <div className="text-yellow-600 text-xs mt-1">
                                    (Replaced due to rain)
                                  </div>
                                )}
                                {act.indoorSuggestion && (
                                  <div className="mt-2 p-2 border rounded bg-blue-100">
                                    <div className="font-semibold text-blue-600">
                                      Indoor Suggestion:{' '}
                                      {act.indoorSuggestion.name} (
                                      {act.indoorSuggestion.region})
                                    </div>
                                    <div className="text-sm text-gray-700 flex flex-wrap gap-4">
                                      <span>
                                        Category:{' '}
                                        {act.indoorSuggestion.category}
                                      </span>
                                      <span>
                                        Type:{' '}
                                        {act.indoorSuggestion.activityType}
                                      </span>
                                      <span>
                                        Rating: {act.indoorSuggestion.rating}
                                      </span>
                                      <span>
                                        Tags:{' '}
                                        {act.indoorSuggestion.tags &&
                                          act.indoorSuggestion.tags.join(', ')}
                                      </span>
                                      <span>
                                        Avg Time: {act.indoorSuggestion.avgTime}{' '}
                                        hrs
                                      </span>
                                      <span>
                                        Avg Ticket: Rs{' '}
                                        {act.indoorSuggestion.avgTicketPrice}
                                      </span>
                                      {act.indoorSuggestion
                                        .suggestedDueToRain && (
                                        <div className="text-blue-500 text-xs mt-1">
                                          (Suggested due to rain)
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 justify-end mt-12 border-t pt-8">
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-full shadow transition focus:outline-none focus:ring-2 focus:ring-gray-400 text-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setIsEditing(true);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 py-3 rounded-full shadow transition focus:outline-none focus:ring-2 focus:ring-yellow-300 text-lg"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          setLoading(true);
                          setError('');
                          // Log the data being sent
                          console.log({
                            interests,
                            startDate: startDate?.toISOString().slice(0, 10),
                            endDate: endDate?.toISOString().slice(0, 10),
                            numPeople,
                            startingPoint: itinerary?.startingPoint,
                            totalDays: itinerary?.totalDays,
                            totalDistance: itinerary?.totalDistance,
                            travelMode: itinerary?.travelMode,
                            totalFuelCost: itinerary?.totalFuelCost,
                            totalCost: itinerary?.totalCost,
                            itinerary: itinerary?.itinerary,
                          });
                          // Save itinerary to backend
                          await axios.post(
                            'http://localhost:3000/api/itineraries',
                            {
                              interests,
                              startDate: startDate?.toISOString().slice(0, 10),
                              endDate: endDate?.toISOString().slice(0, 10),
                              numPeople,
                              startingPoint: itinerary?.startingPoint,
                              totalDays: itinerary?.totalDays,
                              totalDistance: itinerary?.totalDistance,
                              travelMode: itinerary?.travelMode,
                              totalFuelCost: itinerary?.totalFuelCost,
                              totalCost: itinerary?.totalCost,
                              itinerary: itinerary?.itinerary,
                            },
                            { withCredentials: true },
                          );
                          setConfirmedItinerary(itinerary);
                          setShowModal(false);
                          setIsEditing(false);
                          setItinerary(null);
                          navigate('/');
                        } catch (err) {
                          setError(
                            'Failed to save itinerary. Please try again.',
                          );
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Show only the confirmed itinerary below the form, if exists */}
      {confirmedItinerary && (
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-lg animate-fade-in">
          <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <FaMapMarkedAlt className="text-blue-500" /> Your Confirmed Trip
            Plan
          </h2>
          {/* ...render confirmedItinerary details here, similar to modal... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
              <span className="font-semibold text-blue-700">
                Starting Point
              </span>
              <span className="text-lg font-bold text-blue-900">
                {confirmedItinerary.startingPoint}
              </span>
            </div>
            <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
              <span className="font-semibold text-blue-700">Total Days</span>
              <span className="text-lg font-bold text-blue-900">
                {confirmedItinerary.totalDays}
              </span>
            </div>
            <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
              <span className="font-semibold text-blue-700">
                Total Distance
              </span>
              <span className="text-lg font-bold text-blue-900">
                {confirmedItinerary.totalDistance} km
              </span>
            </div>
            <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
              <span className="font-semibold text-blue-700">Travel Mode</span>
              <span className="text-lg font-bold text-blue-900">
                {confirmedItinerary.travelMode}
              </span>
            </div>
            <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
              <span className="font-semibold text-blue-700">
                Estimated Fuel Cost
              </span>
              <span className="text-lg font-bold text-blue-900">
                Rs {confirmedItinerary.totalFuelCost}
              </span>
            </div>
            <div className="bg-gradient-to-br from-blue-200/70 to-blue-50 rounded-xl p-5 flex flex-col gap-2 shadow-md border border-blue-100">
              <span className="font-semibold text-blue-700">
                Estimated Ticket Cost
              </span>
              <span className="text-lg font-bold text-blue-900">
                Rs {confirmedItinerary.totalCost}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-blue-800 text-2xl mb-6 flex items-center gap-3">
              <FaCalendarAlt className="text-blue-500" /> Day-by-Day Itinerary
            </h3>
            <ul className="space-y-7 max-h-80 overflow-y-auto pr-2">
              {confirmedItinerary.itinerary.map((day) => (
                <li
                  key={day.day}
                  className="bg-white border-l-4 border-blue-600 rounded-xl shadow-md p-5 hover:shadow-lg transition-all"
                >
                  <div className="font-semibold text-blue-700 mb-3 text-lg flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-400" /> Day {day.day}
                  </div>
                  <ul className="space-y-3 ml-2">
                    {day.activities.map((act, idx) => (
                      <li
                        key={idx}
                        className="bg-blue-50 rounded-lg p-4 border border-blue-100 hover:bg-blue-100 transition-all"
                      >
                        <div className="font-semibold text-blue-800 text-base flex items-center gap-2">
                          <FaMapMarkedAlt className="text-blue-400" />{' '}
                          {act.name}{' '}
                          <span className="text-xs text-gray-500">
                            ({act.region})
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 flex flex-wrap gap-4 mt-1">
                          <span>
                            Category:{' '}
                            <span className="font-medium text-blue-700">
                              {act.category}
                            </span>
                          </span>
                          <span>
                            Type:{' '}
                            <span className="font-medium text-blue-700">
                              {act.activityType}
                            </span>
                          </span>
                          <span>
                            Rating:{' '}
                            <span className="font-medium text-blue-700">
                              {act.rating}
                            </span>
                          </span>
                          <span>
                            Tags:{' '}
                            <span className="font-medium text-blue-700">
                              {act.tags && act.tags.join(', ')}
                            </span>
                          </span>
                          <span>
                            Avg Time:{' '}
                            <span className="font-medium text-blue-700">
                              {act.avgTime} hrs
                            </span>
                          </span>
                          <span>
                            Avg Ticket:{' '}
                            <span className="font-medium text-blue-700">
                              Rs {act.avgTicketPrice}
                            </span>
                          </span>
                        </div>
                        {act.replacedDueToRain && (
                          <div className="text-yellow-600 text-xs mt-1">
                            (Replaced due to rain)
                          </div>
                        )}
                        {act.indoorSuggestion && (
                          <div className="mt-2 p-2 border rounded bg-blue-100">
                            <div className="font-semibold text-blue-600">
                              Indoor Suggestion: {act.indoorSuggestion.name} (
                              {act.indoorSuggestion.region})
                            </div>
                            <div className="text-sm text-gray-700 flex flex-wrap gap-4">
                              <span>
                                Category: {act.indoorSuggestion.category}
                              </span>
                              <span>
                                Type: {act.indoorSuggestion.activityType}
                              </span>
                              <span>Rating: {act.indoorSuggestion.rating}</span>
                              <span>
                                Tags:{' '}
                                {act.indoorSuggestion.tags &&
                                  act.indoorSuggestion.tags.join(', ')}
                              </span>
                              <span>
                                Avg Time: {act.indoorSuggestion.avgTime} hrs
                              </span>
                              <span>
                                Avg Ticket: Rs{' '}
                                {act.indoorSuggestion.avgTicketPrice}
                              </span>
                              {act.indoorSuggestion.suggestedDueToRain && (
                                <div className="text-blue-500 text-xs mt-1">
                                  (Suggested due to rain)
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePackage;
