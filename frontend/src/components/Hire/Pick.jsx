import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pick = () => {
  const [formData, setFormData] = useState({
    pickupLocation: 'BIA Arrival Terminal, Katunayake, Sri Lanka',
    dropLocation: '',
    date: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    selectedVehicle: ''
  });

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        console.log('Fetching vehicles...');
        const response = await axios.get("http://localhost:3000/api/vehicles");
        console.log('API Response:', response.data);
        
        if (response.data && response.data.data && response.data.data.vehicles) {
          setVehicles(response.data.data.vehicles);
        } else if (response.data && Array.isArray(response.data)) {
          setVehicles(response.data);
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          setError('No response from server. Please check if the server is running.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up request:', error.message);
          setError('Failed to connect to server');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleVehicleSelect = (vehicleId) => {
    setFormData(prevState => ({
      ...prevState,
      selectedVehicle: vehicleId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate date
      const selectedDate = new Date(formData.date);
      const currentDate = new Date();
      
      if (selectedDate < currentDate) {
        alert('Please select a future date and time');
        return;
      }

      const { selectedVehicle, ...otherData } = formData;
      const response = await axios.post('http://localhost:3000/api/pickup', {
        ...otherData,
        vehicle: selectedVehicle
      });
      console.log('Booking successful:', response.data);
      alert('Pickup booking successfully submitted!');
      // Clear form
      setFormData({
        pickupLocation: 'BIA Arrival Terminal, Katunayake, Sri Lanka',
        dropLocation: '',
        date: '',
        name: '',
        email: '',
        phone: '',
        notes: '',
        selectedVehicle: ''
      });
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed: ' + (err.response?.data?.message || 'Please try again later'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
            <h3 className="text-2xl font-bold text-white">Pickup Service Details</h3>
            <p className="text-blue-100 mt-2 max-w-md mx-auto">Book your airport pickup service with our reliable and comfortable vehicles</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Drop Location
                </label>
                <input
                  type="text"
                  name="dropLocation"
                  value={formData.dropLocation}
                  onChange={handleChange}
                  placeholder="Enter drop location"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Vehicle
              </label>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading vehicles...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-red-500">{error}</p>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No vehicles available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle._id}
                      onClick={() => handleVehicleSelect(vehicle._id)}
                      className={`p-6 border rounded-xl cursor-pointer transition-all duration-300 ${
                        formData.selectedVehicle === vehicle._id
                          ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-lg text-gray-800">{vehicle.name}</h4>
                      </div>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{vehicle.passengers || 'N/A'} Passengers</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span>{vehicle.baggage || 'N/A'} Bags</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special requirements?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="3"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={!formData.selectedVehicle}
                className={`px-8 py-4 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 ${
                  formData.selectedVehicle
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Book Pickup Service
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pick; 