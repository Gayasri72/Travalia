import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AddPackages = () => {
  const [tourData, setTourData] = useState({
    name: '',
    duration: '',
    maxGroupSize: '',
    difficulty: '',
    price: '',
    priceDiscount: '',
    summary: '',
    description: '',
    imageCover: '',
    images: [],
    startDates: [],
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    // Validate each field
    if (!tourData.name) newErrors.name = 'Tour name is required';
    if (!tourData.duration || tourData.duration <= 0) newErrors.duration = 'Duration must be greater than 0';
    if (!tourData.maxGroupSize || tourData.maxGroupSize <= 0) newErrors.maxGroupSize = 'Max group size must be greater than 0';
    if (!tourData.difficulty) newErrors.difficulty = 'Difficulty is required';
    if (!tourData.price || tourData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (tourData.priceDiscount < 0 || tourData.priceDiscount >= tourData.price) newErrors.priceDiscount = 'Discount must be less than the price';
    if (!tourData.summary) newErrors.summary = 'Summary is required';
    if (!tourData.imageCover) newErrors.imageCover = 'Cover image URL is required';
    if (!tourData.startDates.length) newErrors.startDates = 'At least one start date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTourData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setTourData((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      for (const key in tourData) {
        if (Array.isArray(tourData[key])) {
          tourData[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, tourData[key]);
        }
      }

      const response = await fetch('http://localhost:3000/api/tours', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        navigate(`/tour/${result.data.tour._id}`); // Redirect to tour details page
      } else {
        setErrorMessage(result.message || 'Failed to add tour');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Add Tour Package</h1>

      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block font-bold text-lg">Tour Name</label>
            <input
              type="text"
              name="name"
              value={tourData.name}
              onChange={handleInputChange}
              required
              className={`w-full p-3 mt-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="block font-bold text-lg">Duration (in days)</label>
            <input
              type="number"
              name="duration"
              value={tourData.duration}
              onChange={handleInputChange}
              required
              className={`w-full p-3 mt-2 border ${errors.duration ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
          </div>

          {/* Group Size */}
          <div>
            <label className="block font-bold text-lg">Max Group Size</label>
            <input
              type="number"
              name="maxGroupSize"
              value={tourData.maxGroupSize}
              onChange={handleInputChange}
              required
              className={`w-full p-3 mt-2 border ${errors.maxGroupSize ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.maxGroupSize && <p className="text-red-500 text-sm">{errors.maxGroupSize}</p>}
          </div>

          {/* Difficulty */}
          <div>
            <label className="block font-bold text-lg">Difficulty</label>
            <input
              type="text"
              name="difficulty"
              value={tourData.difficulty}
              onChange={handleInputChange}
              required
              className={`w-full p-3 mt-2 border ${errors.difficulty ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block font-bold text-lg">Price</label>
            <input
              type="number"
              name="price"
              value={tourData.price}
              onChange={handleInputChange}
              required
              className={`w-full p-3 mt-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          {/* Price Discount */}
          <div>
            <label className="block font-bold text-lg">Price Discount</label>
            <input
              type="number"
              name="priceDiscount"
              value={tourData.priceDiscount}
              onChange={handleInputChange}
              className={`w-full p-3 mt-2 border ${errors.priceDiscount ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.priceDiscount && <p className="text-red-500 text-sm">{errors.priceDiscount}</p>}
          </div>

          {/* Summary */}
          <div className="col-span-2">
            <label className="block font-bold text-lg">Summary</label>
            <textarea
              name="summary"
              value={tourData.summary}
              onChange={handleInputChange}
              required
              className={`w-full p-3 mt-2 border ${errors.summary ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.summary && <p className="text-red-500 text-sm">{errors.summary}</p>}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block font-bold text-lg">Description</label>
            <textarea
              name="description"
              value={tourData.description}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Image Cover */}
          <div className="col-span-2">
            <label className="block font-bold text-lg">Cover Image URL</label>
            <input
              type="text"
              name="imageCover"
              value={tourData.imageCover}
              onChange={handleInputChange}
              required
              className={`w-full p-3 mt-2 border ${errors.imageCover ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.imageCover && <p className="text-red-500 text-sm">{errors.imageCover}</p>}
          </div>

          {/* Tour Images */}
          <div className="col-span-2">
            <label className="block font-bold text-lg">Tour Images</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleImageChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Start Dates */}
          <div className="col-span-2">
            <label className="block font-bold text-lg">Start Dates</label>
            <input
              type="date"
              name="startDates"
              onChange={(e) => setTourData({ ...tourData, startDates: [e.target.value] })}
              className={`w-full p-3 mt-2 border ${errors.startDates ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.startDates && <p className="text-red-500 text-sm">{errors.startDates}</p>}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:bg-blue-700"
          >
            Add Tour Package
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPackages;
