
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory

// const EditPackages = () => {
//   const { id } = useParams(); // useParams hook to get the 'id' from the URL
//   const [tour, setTour] = useState({
//     name: '',
//     duration: 0,
//     maxGroupSize: 0,
//     difficulty: '',
//     ratingsAverage: 0,
//     ratingsQuantity: 0,
//     price: 0,
//     priceDiscount: 0,
//     summary: '',
//     description: '',
//     imageCover: '',
//     images: [],
//     startDates: [],
//   });

//   const navigate = useNavigate(); // useNavigate for programmatic navigation

//   useEffect(() => {
//     const fetchTour = async () => {
//       try {
//         const response = await axios.get(`/api/tours/${id}`); // API request to fetch tour by id
//         setTour(response.data.data.tour);
//       } catch (error) {
//         console.error('Error fetching tour:', error.message);
//       }
//     };

//     fetchTour();
//   }, [id]); // Run the effect only when 'id' changes

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTour((prevTour) => ({
//       ...prevTour,
//       [name]: value, // Dynamically update the field value based on input name
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.patch(`/api/tours/${id}`, tour);
//       console.log('Tour updated:', response.data.data.tour);
//       navigate('/tours'); // Redirect to tours page after update
//     } catch (error) {
//       console.error('Error updating tour:', error.message);
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen flex items-center justify-center py-8">
//       <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Edit Tour</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={tour.name}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Duration (in days):</label>
//             <input
//               type="number"
//               name="duration"
//               value={tour.duration}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Max Group Size:</label>
//             <input
//               type="number"
//               name="maxGroupSize"
//               value={tour.maxGroupSize}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Difficulty:</label>
//             <input
//               type="text"
//               name="difficulty"
//               value={tour.difficulty}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Ratings Average:</label>
//             <input
//               type="number"
//               name="ratingsAverage"
//               value={tour.ratingsAverage}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Ratings Quantity:</label>
//             <input
//               type="number"
//               name="ratingsQuantity"
//               value={tour.ratingsQuantity}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Price:</label>
//             <input
//               type="number"
//               name="price"
//               value={tour.price}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Price Discount:</label>
//             <input
//               type="number"
//               name="priceDiscount"
//               value={tour.priceDiscount}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Summary:</label>
//             <textarea
//               name="summary"
//               value={tour.summary}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32"
//             ></textarea>
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Description:</label>
//             <textarea
//               name="description"
//               value={tour.description}
//               onChange={handleChange}
//               required
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32"
//             ></textarea>
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Image Cover URL:</label>
//             <input
//               type="text"
//               name="imageCover"
//               value={tour.imageCover}
//               onChange={handleChange}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Images (comma separated):</label>
//             <input
//               type="text"
//               name="images"
//               value={tour.images.join(', ')}
//               onChange={(e) => {
//                 const { value } = e.target;
//                 setTour((prevTour) => ({
//                   ...prevTour,
//                   images: value.split(',').map((image) => image.trim()), // Convert the string to an array
//                 }));
//               }}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="form-group">
//             <label className="block text-lg font-medium text-gray-700">Start Dates:</label>
//             <input
//               type="text"
//               name="startDates"
//               value={tour.startDates.join(', ')}
//               onChange={(e) => {
//                 const { value } = e.target;
//                 setTour((prevTour) => ({
//                   ...prevTour,
//                   startDates: value.split(',').map((date) => date.trim()), // Convert the string to an array of dates
//                 }));
//               }}
//               className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Update Tour
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditPackages;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPackages = () => {
  const { id } = useParams();
  const [tour, setTour] = useState({
    name: '',
    duration: 0,
    maxGroupSize: 0,
    difficulty: '',
    ratingsAverage: 0,
    ratingsQuantity: 0,
    price: 0,
    priceDiscount: 0,
    summary: '',
    description: '',
    imageCover: '',
    images: [],
    startDates: [],
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

    // Check required fields
    if (!tour.name) newErrors.name = 'Name is required.';
    if (!tour.difficulty) newErrors.difficulty = 'Difficulty is required.';
    if (!tour.summary) newErrors.summary = 'Summary is required.';
    if (!tour.description) newErrors.description = 'Description is required.';
    if (!tour.imageCover) newErrors.imageCover = 'Image cover is required.';
    if (!tour.startDates || tour.startDates.length === 0) newErrors.startDates = 'At least one start date is required.';

    // Validate number fields
    if (tour.duration <= 0) newErrors.duration = 'Duration must be a positive number.';
    if (tour.maxGroupSize <= 0) newErrors.maxGroupSize = 'Max group size must be a positive number.';
    if (tour.ratingsAverage < 0 || tour.ratingsAverage > 5) newErrors.ratingsAverage = 'Ratings average must be between 0 and 5.';
    if (tour.ratingsQuantity < 0) newErrors.ratingsQuantity = 'Ratings quantity cannot be negative.';
    if (tour.price < 0) newErrors.price = 'Price cannot be negative.';
    if (tour.priceDiscount < 0) newErrors.priceDiscount = 'Price discount cannot be negative.';

    // Validate image URLs
    if (tour.images.some((image) => !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(image))) {
      newErrors.images = 'All images must be valid URLs ending with .jpg, .jpeg, .png, or .gif.';
    }

    // Validate start dates (basic validation for date format)
    if (tour.startDates.some((date) => isNaN(Date.parse(date)))) {
      newErrors.startDates = 'All start dates must be valid dates.';
    }

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
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-8">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Edit Tour</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={tour.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Duration (in days):</label>
            <input
              type="number"
              name="duration"
              value={tour.duration}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Max Group Size:</label>
            <input
              type="number"
              name="maxGroupSize"
              value={tour.maxGroupSize}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.maxGroupSize && <p className="text-red-500 text-sm">{errors.maxGroupSize}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Difficulty:</label>
            <input
              type="text"
              name="difficulty"
              value={tour.difficulty}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Ratings Average:</label>
            <input
              type="number"
              name="ratingsAverage"
              value={tour.ratingsAverage}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.ratingsAverage && <p className="text-red-500 text-sm">{errors.ratingsAverage}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Ratings Quantity:</label>
            <input
              type="number"
              name="ratingsQuantity"
              value={tour.ratingsQuantity}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.ratingsQuantity && <p className="text-red-500 text-sm">{errors.ratingsQuantity}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Price:</label>
            <input
              type="number"
              name="price"
              value={tour.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Price Discount:</label>
            <input
              type="number"
              name="priceDiscount"
              value={tour.priceDiscount}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.priceDiscount && <p className="text-red-500 text-sm">{errors.priceDiscount}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Summary:</label>
            <textarea
              name="summary"
              value={tour.summary}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32"
            ></textarea>
            {errors.summary && <p className="text-red-500 text-sm">{errors.summary}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Description:</label>
            <textarea
              name="description"
              value={tour.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Image Cover URL:</label>
            <input
              type="text"
              name="imageCover"
              value={tour.imageCover}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.imageCover && <p className="text-red-500 text-sm">{errors.imageCover}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Images URLs (separated by commas):</label>
            <input
              type="text"
              name="images"
              value={tour.images.join(', ')}
              onChange={(e) => {
                setTour((prevTour) => ({
                  ...prevTour,
                  images: e.target.value.split(',').map((url) => url.trim()),
                }));
              }}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
          </div>

          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">Start Dates (separated by commas):</label>
            <input
              type="text"
              name="startDates"
              value={tour.startDates.join(', ')}
              onChange={(e) => {
                setTour((prevTour) => ({
                  ...prevTour,
                  startDates: e.target.value.split(',').map((date) => date.trim()),
                }));
              }}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.startDates && <p className="text-red-500 text-sm">{errors.startDates}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Update Tour
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPackages;
