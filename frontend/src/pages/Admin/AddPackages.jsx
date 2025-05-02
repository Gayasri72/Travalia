import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    imageCover: null,
    images: [],
    startDates: [],
    guides: [], // <-- Add guides array
  });
  const [guideInput, setGuideInput] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [locations, setLocations] = useState([
    { type: 'Point', coordinates: ['', ''], description: '', day: '' },
  ]);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!tourData.name.trim()) newErrors.name = 'Tour name is required';
    if (!tourData.duration || tourData.duration <= 0)
      newErrors.duration = 'Duration must be greater than 0';
    if (!tourData.maxGroupSize || tourData.maxGroupSize <= 0)
      newErrors.maxGroupSize = 'Max group size must be greater than 0';
    if (!tourData.difficulty.trim())
      newErrors.difficulty = 'Difficulty is required';
    if (!tourData.price || tourData.price <= 0)
      newErrors.price = 'Price must be greater than 0';
    if (
      tourData.priceDiscount &&
      (Number(tourData.priceDiscount) < 0 ||
        Number(tourData.priceDiscount) >= Number(tourData.price))
    )
      newErrors.priceDiscount = 'Discount must be less than the price';
    if (!tourData.summary.trim()) newErrors.summary = 'Summary is required';
    if (!tourData.imageCover) newErrors.imageCover = 'Cover image is required';
    if (tourData.startDates.length === 0)
      newErrors.startDates = 'At least one start date is required';
    if (locations.length < 2)
      newErrors.locations = 'At least 2 locations are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTourData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'imageCover') {
      setTourData((prev) => ({ ...prev, imageCover: e.target.files[0] }));
    } else {
      setTourData((prev) => ({ ...prev, images: Array.from(e.target.files) }));
    }
  };

  const handleLocationChange = (idx, field, value) => {
    setLocations((prev) =>
      prev.map((loc, i) => (i === idx ? { ...loc, [field]: value } : loc)),
    );
  };

  const addLocation = () => {
    setLocations((prev) => [
      ...prev,
      { type: 'Point', coordinates: ['', ''], description: '', day: '' },
    ]);
  };

  const removeLocation = (idx) => {
    setLocations((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      // Ensure all required fields are present and sent as strings
      formData.set('name', tourData.name || '');
      formData.set('duration', String(tourData.duration || ''));
      formData.set('maxGroupSize', String(tourData.maxGroupSize || ''));
      formData.set('difficulty', tourData.difficulty || '');
      formData.set('price', String(tourData.price || ''));
      formData.set('summary', tourData.summary || '');
      formData.set('description', tourData.description || '');
      // Always append imageCover if present
      if (tourData.imageCover) {
        formData.append('imageCover', tourData.imageCover);
      }
      // Append each image file for gallery images (multiple)
      if (tourData.images && tourData.images.length > 0) {
        tourData.images.forEach((img) => {
          formData.append('images', img);
        });
      }
      formData.set('startDates', JSON.stringify(tourData.startDates));
      // Locations as JSON string
      formData.set(
        'locations',
        JSON.stringify(
          locations.map((loc) => ({
            ...loc,
            coordinates: [
              parseFloat(loc.coordinates[0]),
              parseFloat(loc.coordinates[1]),
            ],
            day: Number(loc.day),
          })),
        ),
      );
      formData.set('guides', JSON.stringify(tourData.guides)); // <-- Add guides to formData
      const response = await fetch('http://localhost:3000/api/tours', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        navigate(`/tour/${result.data.tour._id}`);
      } else {
        setErrorMessage(result.message || 'Failed to add tour');
      }
    } catch (error) {
      console.log('CREATE TOUR ERROR:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 bg-white shadow-2xl rounded-3xl mt-10 border border-gray-100">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700 drop-shadow flex items-center justify-center gap-2">
        <svg
          className="w-8 h-8 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 4v16m8-8H4"></path>
        </svg>
        Add Tour Package
      </h1>
      {errorMessage && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 text-center animate-pulse">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Info */}
        <div className="bg-blue-50/50 rounded-2xl p-6 shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 4v16m8-8H4"></path>
            </svg>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Tour Name
              </label>
              <input
                type="text"
                name="name"
                value={tourData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            {/* Duration */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Duration (days)
              </label>
              <input
                type="number"
                name="duration"
                value={tourData.duration}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>
            {/* Max Group Size */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Max Group Size
              </label>
              <input
                type="number"
                name="maxGroupSize"
                value={tourData.maxGroupSize}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
              {errors.maxGroupSize && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maxGroupSize}
                </p>
              )}
            </div>
            {/* Difficulty */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={tourData.difficulty}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="difficult">Difficult</option>
              </select>
              {errors.difficulty && (
                <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>
              )}
            </div>
            {/* Price */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={tourData.price}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
            {/* Price Discount */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Price Discount
              </label>
              <input
                type="number"
                name="priceDiscount"
                value={tourData.priceDiscount}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
              {errors.priceDiscount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.priceDiscount}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Description & Summary */}
        <div className="bg-blue-50/50 rounded-2xl p-6 shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path>
            </svg>
            Details
          </h2>
          {/* Summary */}
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold mb-2 text-gray-700">
              Summary
            </label>
            <textarea
              name="summary"
              value={tourData.summary}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-none min-h-[60px]"
            />
            {errors.summary && (
              <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
            )}
          </div>
          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold mb-2 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={tourData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-none min-h-[80px]"
            />
          </div>
        </div>
        {/* Images */}
        <div className="bg-blue-50/50 rounded-2xl p-6 shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"></path>
            </svg>
            Images
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Cover */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Cover Image
              </label>
              <input
                type="file"
                name="imageCover"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
              {errors.imageCover && (
                <p className="text-red-500 text-sm mt-1">{errors.imageCover}</p>
              )}
            </div>
            {/* Images */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Gallery Images
              </label>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>
          </div>
        </div>
        {/* Start Dates */}
        <div className="bg-blue-50/50 rounded-2xl p-6 shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Start Dates
          </h2>
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold mb-2 text-gray-700">
              Start Dates
            </label>
            <input
              type="date"
              name="startDates"
              onChange={(e) =>
                setTourData({ ...tourData, startDates: [e.target.value] })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
            {errors.startDates && (
              <p className="text-red-500 text-sm mt-1">{errors.startDates}</p>
            )}
          </div>
        </div>
        {/* Guides */}
        <div className="bg-blue-50/50 rounded-2xl p-6 shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75"></path>
            </svg>
            Tour Guides
          </h2>
          <div className="md:col-span-2">
            <label className="block text-lg font-semibold mb-2 text-gray-700">
              Tour Guides
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={guideInput}
                onChange={(e) => setGuideInput(e.target.value)}
                placeholder="Enter guide name"
                className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  if (guideInput.trim()) {
                    setTourData((prev) => ({
                      ...prev,
                      guides: [...prev.guides, guideInput.trim()],
                    }));
                    setGuideInput('');
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Add
              </button>
            </div>
            <ul className="list-disc ml-6">
              {tourData.guides.map((g, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {g}
                  <button
                    type="button"
                    onClick={() =>
                      setTourData((prev) => ({
                        ...prev,
                        guides: prev.guides.filter((_, i) => i !== idx),
                      }))
                    }
                    className="text-red-500 text-xs ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Locations */}
        <div className="bg-blue-50/50 rounded-2xl p-6 shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243a8 8 0 1111.314 0z"></path>
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Locations
          </h2>
          {errors.locations && (
            <p className="text-red-500 text-sm mb-2">{errors.locations}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((loc, idx) => (
              <div
                key={idx}
                className="mb-4 p-6 border border-blue-100 rounded-xl bg-blue-50/30 shadow flex flex-col gap-3 relative"
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Longitude"
                    value={loc.coordinates[0]}
                    onChange={(e) =>
                      handleLocationChange(idx, 'coordinates', [
                        e.target.value,
                        loc.coordinates[1],
                      ])
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                  <input
                    type="text"
                    placeholder="Latitude"
                    value={loc.coordinates[1]}
                    onChange={(e) =>
                      handleLocationChange(idx, 'coordinates', [
                        loc.coordinates[0],
                        e.target.value,
                      ])
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Description"
                  value={loc.description}
                  onChange={(e) =>
                    handleLocationChange(idx, 'description', e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Day"
                  value={loc.day}
                  onChange={(e) =>
                    handleLocationChange(idx, 'day', e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
                {locations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLocation(idx)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLocation}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
          >
            Add Location
          </button>
        </div>
        <div className="flex justify-end mt-10">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-xl transition-all"
          >
            Add Tour Package
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPackages;
