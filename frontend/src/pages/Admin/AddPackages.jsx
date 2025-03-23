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
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!tourData.name.trim()) newErrors.name = 'Tour name is required';
    if (!tourData.duration || tourData.duration <= 0) newErrors.duration = 'Duration must be greater than 0';
    if (!tourData.maxGroupSize || tourData.maxGroupSize <= 0) newErrors.maxGroupSize = 'Max group size must be greater than 0';
    if (!tourData.difficulty.trim()) newErrors.difficulty = 'Difficulty is required';
    if (!tourData.price || tourData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (tourData.priceDiscount && (tourData.priceDiscount < 0 || tourData.priceDiscount >= tourData.price)) newErrors.priceDiscount = 'Discount must be less than the price';
    if (!tourData.summary.trim()) newErrors.summary = 'Summary is required';
    if (!tourData.imageCover) newErrors.imageCover = 'Cover image is required';
    if (tourData.startDates.length === 0) newErrors.startDates = 'At least one start date is required';
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      for (const key in tourData) {
        if (key === 'images' || key === 'startDates') {
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
        navigate(`/tour/${result.data.tour._id}`);
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
          <input type="text" name="name" placeholder="Tour Name" value={tourData.name} onChange={handleInputChange} className="border p-2" />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
          <input type="number" name="duration" placeholder="Duration (days)" value={tourData.duration} onChange={handleInputChange} className="border p-2" />
          {errors.duration && <p className="text-red-500">{errors.duration}</p>}
          <input type="number" name="maxGroupSize" placeholder="Max Group Size" value={tourData.maxGroupSize} onChange={handleInputChange} className="border p-2" />
          {errors.maxGroupSize && <p className="text-red-500">{errors.maxGroupSize}</p>}
          <input type="text" name="difficulty" placeholder="Difficulty" value={tourData.difficulty} onChange={handleInputChange} className="border p-2" />
          {errors.difficulty && <p className="text-red-500">{errors.difficulty}</p>}
          <input type="number" name="price" placeholder="Price" value={tourData.price} onChange={handleInputChange} className="border p-2" />
          {errors.price && <p className="text-red-500">{errors.price}</p>}
          <input type="number" name="priceDiscount" placeholder="Price Discount" value={tourData.priceDiscount} onChange={handleInputChange} className="border p-2" />
          {errors.priceDiscount && <p className="text-red-500">{errors.priceDiscount}</p>}
          <textarea name="summary" placeholder="Summary" value={tourData.summary} onChange={handleInputChange} className="border p-2"></textarea>
          {errors.summary && <p className="text-red-500">{errors.summary}</p>}
          <textarea name="description" placeholder="Description" value={tourData.description} onChange={handleInputChange} className="border p-2"></textarea>
          <input type="file" name="imageCover" onChange={handleFileChange} className="border p-2" />
          {errors.imageCover && <p className="text-red-500">{errors.imageCover}</p>}
          <input type="file" name="images" multiple onChange={handleFileChange} className="border p-2" />
          <input type="date" name="startDates" onChange={(e) => setTourData({ ...tourData, startDates: [e.target.value] })} className="border p-2" />
          {errors.startDates && <p className="text-red-500">{errors.startDates}</p>}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 mt-4 rounded-lg">Add Tour Package</button>
      </form>
    </div>
  );
};

export default AddPackages;
