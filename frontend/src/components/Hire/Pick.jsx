import React, { useState } from 'react';
import axios from 'axios';

const Pick = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    flightNumber: '',
    pickupTime: '',
    destination: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5173/api/pick', formData);
      alert('Pickup request submitted successfully!');
      setFormData({ name: '', contact: '', flightNumber: '', pickupTime: '', destination: '' });
    } catch (error) {
      console.error('Error submitting pickup request:', error);
      alert('Failed to submit pickup request.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Airport Pickup</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          placeholder="Enter your name"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Contact</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          placeholder="Enter your contact number"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Flight Number</label>
        <input
          type="text"
          name="flightNumber"
          value={formData.flightNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          placeholder="Enter your flight number"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Pickup Time</label>
        <input
          type="datetime-local"
          name="pickupTime"
          value={formData.pickupTime}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Destination</label>
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg"
          placeholder="Enter your destination"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default Pick;