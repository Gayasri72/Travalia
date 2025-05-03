import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const EditPackages = () => {
  const { id } = useParams();
  const [tour, setTour] = useState({
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
    guides: [],
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`/api/tours/${id}`);
        setTour(response.data.data.tour);
      } catch (error) {
        console.error('Error fetching tour:', error.message);
      }
    };

    fetchTour();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTour((prevTour) => ({
      ...prevTour,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!tour.name || tour.name.trim().length < 3)
      newErrors.name = 'Name is required and must be at least 3 characters.';

    // Duration validation
    if (!tour.duration || isNaN(tour.duration) || Number(tour.duration) <= 0)
      newErrors.duration = 'Duration must be a positive number.';

    // Max group size validation
    if (
      !tour.maxGroupSize ||
      isNaN(tour.maxGroupSize) ||
      Number(tour.maxGroupSize) <= 0
    )
      newErrors.maxGroupSize = 'Max group size must be a positive number.';

    // Difficulty validation
    if (
      !tour.difficulty ||
      !['easy', 'medium', 'difficult'].includes(tour.difficulty.toLowerCase())
    )
      newErrors.difficulty =
        'Difficulty is required and must be easy, medium, or difficult.';

    // Ratings average validation
    if (
      tour.ratingsAverage === '' ||
      isNaN(tour.ratingsAverage) ||
      Number(tour.ratingsAverage) < 0 ||
      Number(tour.ratingsAverage) > 5
    )
      newErrors.ratingsAverage = 'Ratings average must be between 0 and 5.';

    // Ratings quantity validation
    if (
      tour.ratingsQuantity === '' ||
      isNaN(tour.ratingsQuantity) ||
      Number(tour.ratingsQuantity) < 0
    )
      newErrors.ratingsQuantity = 'Ratings quantity cannot be negative.';

    // Price validation
    if (tour.price === '' || isNaN(tour.price) || Number(tour.price) < 0)
      newErrors.price = 'Price cannot be negative.';

    // Price discount validation
    // if ( isNaN(tour.priceDiscount) || Number(tour.priceDiscount) < 1)
    //   newErrors.priceDiscount = 'Price discount cannot be negative.';
    if (Number(tour.priceDiscount) > Number(tour.price))
      newErrors.priceDiscount = 'Price discount cannot exceed price.';

    // Summary validation
    if (!tour.summary || tour.summary.trim().length < 10)
      newErrors.summary =
        'Summary is required and must be at least 10 characters.';

    // Description validation
    if (!tour.description || tour.description.trim().length < 20)
      newErrors.description =
        'Description is required and must be at least 20 characters.';

    // Image cover validation
    if (!tour.imageCover || tour.imageCover.trim().length < 5)
      newErrors.imageCover = 'Image cover is required.';

    // Images validation
    if (!tour.images || !Array.isArray(tour.images) || tour.images.length === 0)
      newErrors.images = 'At least one image URL is required.';
    else if (tour.images.some((img) => !img || img.length < 5))
      newErrors.images = 'All images must be valid URLs.';

    // Start dates validation
    if (
      !tour.startDates ||
      !Array.isArray(tour.startDates) ||
      tour.startDates.length === 0
    )
      newErrors.startDates = 'At least one start date is required.';
    else if (tour.startDates.some((date) => isNaN(Date.parse(date))))
      newErrors.startDates = 'All start dates must be valid dates.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.patch(`/api/tours/${id}`, tour);
      console.log('Tour updated:', response.data.data.tour);
      navigate('/tours');
    } catch (error) {
      console.error('Error updating tour:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-2">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight drop-shadow">
            Edit Tour Package
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-blue-50 rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block font-semibold mb-2">Tour Name</label>
                <input
                  type="text"
                  name="name"
                  value={tour.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              {/* Duration */}
              <div>
                <label className="block font-semibold mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={tour.duration}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>
              {/* Max Group Size */}
              <div>
                <label className="block font-semibold mb-2">
                  Max Group Size
                </label>
                <input
                  type="number"
                  name="maxGroupSize"
                  value={tour.maxGroupSize}
                  onChange={handleChange}
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
                <label className="block font-semibold mb-2">Difficulty</label>
                <select
                  name="difficulty"
                  value={tour.difficulty}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                >
                  <option value="">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">Difficult</option>
                </select>
                {errors.difficulty && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.difficulty}
                  </p>
                )}
              </div>
            </div>
          </section>
          {/* Pricing */}
          <section className="bg-blue-50 rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label className="block font-semibold mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={tour.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
              {/* Price Discount */}
              <div>
                <label className="block font-semibold mb-2">
                  Price Discount
                </label>
                <input
                  type="number"
                  name="priceDiscount"
                  value={tour.priceDiscount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
                {errors.priceDiscount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.priceDiscount}
                  </p>
                )}
              </div>
            </div>
          </section>
          {/* Description & Summary */}
          <section className="bg-blue-50 rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary */}
              <div>
                <label className="block font-semibold mb-2">Summary</label>
                <textarea
                  name="summary"
                  value={tour.summary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-none min-h-[60px]"
                />
                {errors.summary && (
                  <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
                )}
              </div>
              {/* Description */}
              <div>
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={tour.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-none min-h-[80px]"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </section>
          {/* Images */}
          <section className="bg-blue-50 rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Cover */}
              <div>
                <label className="block font-semibold mb-2">
                  Image Cover URL
                </label>
                <input
                  type="text"
                  name="imageCover"
                  value={tour.imageCover}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
                {errors.imageCover && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.imageCover}
                  </p>
                )}
              </div>
              {/* Images */}
              <div>
                <label className="block font-semibold mb-2">
                  Images URLs (comma separated)
                </label>
                <input
                  type="text"
                  name="images"
                  value={tour.images.join(', ')}
                  onChange={(e) =>
                    setTour((prevTour) => ({
                      ...prevTour,
                      images: e.target.value
                        .split(',')
                        .map((url) => url.trim()),
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
                {errors.images && (
                  <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                )}
              </div>
            </div>
          </section>
          {/* Start Dates & Guides */}
          <section className="bg-blue-50 rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Schedule & Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Dates */}
              <div>
                <label className="block font-semibold mb-2">
                  Start Dates (comma separated)
                </label>
                <input
                  type="text"
                  name="startDates"
                  value={tour.startDates.join(', ')}
                  onChange={(e) =>
                    setTour((prevTour) => ({
                      ...prevTour,
                      startDates: e.target.value
                        .split(',')
                        .map((date) => date.trim()),
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
                {errors.startDates && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDates}
                  </p>
                )}
              </div>
              {/* Guides */}
              <div>
                <label className="block font-semibold mb-2">
                  Guides (comma separated)
                </label>
                <input
                  type="text"
                  name="guides"
                  value={tour.guides.join(', ')}
                  onChange={(e) =>
                    setTour((prevTour) => ({
                      ...prevTour,
                      guides: e.target.value.split(',').map((g) => g.trim()),
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>
            </div>
          </section>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-xl transition-all"
            >
              <FaSave /> Update Tour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPackages;
