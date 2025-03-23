// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AddPackages = () => {
//   const [tourData, setTourData] = useState({
//     name: '',
//     duration: '',
//     maxGroupSize: '',
//     difficulty: '',
//     price: '',
//     priceDiscount: '',
//     summary: '',
//     description: '',
//     imageCover: '',
//     images: [],
//     startDates: [],
//   });

//   const [errors, setErrors] = useState({});
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};
//     if (!tourData.name) newErrors.name = 'Tour name is required';
//     if (!tourData.duration || tourData.duration <= 0) newErrors.duration = 'Duration must be greater than 0';
//     if (!tourData.maxGroupSize || tourData.maxGroupSize <= 0) newErrors.maxGroupSize = 'Max group size must be greater than 0';
//     if (!tourData.difficulty) newErrors.difficulty = 'Difficulty is required';
//     if (!tourData.price || tourData.price <= 0) newErrors.price = 'Price must be greater than 0';
//     if (tourData.priceDiscount < 0 || tourData.priceDiscount >= tourData.price) newErrors.priceDiscount = 'Discount must be less than the price';
//     if (!tourData.summary) newErrors.summary = 'Summary is required';
//     if (!tourData.imageCover) newErrors.imageCover = 'Cover image URL is required';
//     if (!tourData.startDates.length) newErrors.startDates = 'At least one start date is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTourData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setTourData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
//   };

//   const handleStartDateChange = (e) => {
//     setTourData((prev) => ({ ...prev, startDates: [...prev.startDates, e.target.value] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       for (const key in tourData) {
//         if (Array.isArray(tourData[key])) {
//           tourData[key].forEach((item) => formData.append(key, item));
//         } else {
//           formData.append(key, tourData[key]);
//         }
//       }

//       const response = await fetch('http://localhost:3000/api/tours', {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();
//       if (response.ok) {
//         navigate(`/tour/${result.data.tour._id}`);
//       } else {
//         setErrorMessage(result.message || 'Failed to add tour');
//       }
//     } catch (error) {
//       setErrorMessage('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className=" mb-4 max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h1 className="text-3xl font-bold mb-4 text-center">Add Tour Package</h1>

//       {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block font-bold text-lg">Tour Name</label>
//             <input
//               type="text"
//               name="name"
//               value={tourData.name}
//               onChange={handleInputChange}
//               className={`w-full p-3 mt-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//             />
//             {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Duration (in days)</label>
//             <input
//               type="number"
//               name="duration"
//               value={tourData.duration}
//               onChange={handleInputChange}
//               className={`w-full p-3 mt-2 border ${errors.duration ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//             />
//             {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Max Group Size</label>
//             <input
//               type="number"
//               name="maxGroupSize"
//               value={tourData.maxGroupSize}
//               onChange={handleInputChange}
//               className={`w-full p-3 mt-2 border ${errors.maxGroupSize ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//             />
//             {errors.maxGroupSize && <p className="text-red-500 text-sm">{errors.maxGroupSize}</p>}
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Difficulty</label>
//             <select
//               name="difficulty"
//               value={tourData.difficulty}
//               onChange={handleInputChange}
//               className="w-full p-3 mt-2 border border-gray-300 rounded-md"
//             >
//               <option value="">Select Difficulty</option>
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//             {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty}</p>}
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Price</label>
//             <input type="number" name="price" value={tourData.price} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-md" />
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Price Discount</label>
//             <input type="number" name="priceDiscount" value={tourData.priceDiscount} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-md" />
//           </div>

//           <div className="col-span-2">
//             <label className="block font-bold text-lg">Summary</label>
//             <textarea name="summary" value={tourData.summary} onChange={handleInputChange} className="w-full p-3 mt-2 border border-gray-300 rounded-md" />
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Start Dates</label>
//             <input type="date" onChange={handleStartDateChange} className="w-full p-3 mt-2 border border-gray-300 rounded-md" />
//             {errors.startDates && <p className="text-red-500 text-sm">{errors.startDates}</p>}
//           </div>
//         </div>

//         <div className="mt-6 text-center">
//           <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:bg-blue-700">
//             {loading ? 'Adding...' : 'Add Tour Package'}
//           </button>
//         </div>
//       </form>
//     </div>

//   );
// };

// export default AddPackages;




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AddPackages = () => {
//   const [tourData, setTourData] = useState({
//     name: "",
//     duration: "",
//     maxGroupSize: "",
//     difficulty: "",
//     price: "",
//     priceDiscount: "",
//     summary: "",
//     description: "",
//     imageCover: null,
//     images: [],
//     startDates: [],
//   });

//   const [errors, setErrors] = useState({});
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Get today's date in YYYY-MM-DD format
//   const today = new Date().toISOString().split("T")[0];

//   const validateForm = () => {
//     const newErrors = {};
//     if (!tourData.name) newErrors.name = "Tour name is required";
//     if (!tourData.duration || tourData.duration <= 0) newErrors.duration = "Duration must be greater than 0";
//     if (!tourData.maxGroupSize || tourData.maxGroupSize <= 0) newErrors.maxGroupSize = "Max group size must be greater than 0";
//     if (!tourData.difficulty) newErrors.difficulty = "Difficulty is required";
//     if (!tourData.price || tourData.price <= 0) newErrors.price = "Price must be greater than 0";
//     if (tourData.priceDiscount < 0 || tourData.priceDiscount >= tourData.price) newErrors.priceDiscount = "Invalid discount";
//     if (!tourData.summary) newErrors.summary = "Summary is required";
//     if (!tourData.imageCover) newErrors.imageCover = "Cover image is required";
//     if (!tourData.startDates.length) newErrors.startDates = "At least one start date is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTourData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (name === "imageCover") {
//       setTourData((prev) => ({ ...prev, imageCover: files[0] }));
//     } else {
//       setTourData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
//     }
//   };

//   const handleAddStartDate = (e) => {
//     if (e.target.value) {
//       setTourData((prev) => ({
//         ...prev,
//         startDates: [...prev.startDates, e.target.value],
//       }));
//       e.target.value = "";
//     }
//   };

//   const handleRemoveStartDate = (index) => {
//     setTourData((prev) => ({
//       ...prev,
//       startDates: prev.startDates.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     setErrorMessage("");

//     try {
//       const formData = new FormData();
//       Object.keys(tourData).forEach((key) => {
//         if (Array.isArray(tourData[key])) {
//           tourData[key].forEach((item) => formData.append(key, item));
//         } else {
//           formData.append(key, tourData[key]);
//         }
//       });

//       const response = await fetch("http://localhost:3000/api/tours", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to add tour");
//       }

//       navigate(`/tour/${result.data.tour._id}`);
//     } catch (error) {
//       setErrorMessage(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-lg mt-10">
//       <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
//         Add Tour Package
//       </h1>

//       {errorMessage && (
//         <p className="text-red-600 bg-red-100 border border-red-400 rounded-lg px-4 py-2 text-center mb-4">
//           {errorMessage}
//         </p>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {[
//             { label: "Tour Name", name: "name", type: "text" },
//             { label: "Duration (Days)", name: "duration", type: "number" },
//             { label: "Max Group Size", name: "maxGroupSize", type: "number" },
//             { label: "Price ($)", name: "price", type: "number" },
//             { label: "Discount ($)", name: "priceDiscount", type: "number" },
//           ].map((field) => (
//             <div key={field.name}>
//               <label className="block font-bold text-lg">{field.label}</label>
//               <input
//                 type={field.type}
//                 name={field.name}
//                 value={tourData[field.name]}
//                 onChange={handleInputChange}
//                 className={`w-full p-3 mt-2 border ${
//                   errors[field.name] ? "border-red-500" : "border-gray-300"
//                 } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//               />
//               {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
//             </div>
//           ))}

//           <div>
//             <label className="block font-bold text-lg">Difficulty</label>
//             <select
//               name="difficulty"
//               value={tourData.difficulty}
//               onChange={handleInputChange}
//               className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Difficulty</option>
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Start Dates</label>
//             <input
//               type="date"
//               min={today}
//               onChange={handleAddStartDate}
//               className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
//             />
//             {tourData.startDates.map((date, index) => (
//               <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg mt-2">
//                 {date}
//                 <button onClick={() => handleRemoveStartDate(index)} className="text-red-600 font-bold">X</button>
//               </div>
//             ))}
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Cover Image</label>
//             <input type="file" name="imageCover" onChange={handleFileChange} className="w-full p-3 mt-2 border border-gray-300 rounded-lg" />
//             {tourData.imageCover && <img src={URL.createObjectURL(tourData.imageCover)} alt="Cover Preview" className="mt-2 w-32 h-32 object-cover"/>}
//           </div>
//         </div>

//         <div className="mt-6 text-center">
//           <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-transform hover:scale-105">
//             {loading ? "Adding..." : "Add Tour Package"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddPackages;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AddPackages = () => {
//   const [tourData, setTourData] = useState({
//     name: "",
//     duration: "",
//     maxGroupSize: "",
//     difficulty: "",
//     price: "",
//     priceDiscount: "",
//     summary: "",
//     description: "",
//     imageCover: null,
//     images: [],
//     startDates: [],
//   });

//   const [errors, setErrors] = useState({});
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};
//     if (!tourData.name) newErrors.name = "Tour name is required";
//     if (!tourData.duration || tourData.duration <= 0) newErrors.duration = "Duration must be greater than 0";
//     if (!tourData.maxGroupSize || tourData.maxGroupSize <= 0) newErrors.maxGroupSize = "Max group size must be greater than 0";
//     if (!tourData.difficulty) newErrors.difficulty = "Difficulty is required";
//     if (!tourData.price || tourData.price <= 0) newErrors.price = "Price must be greater than 0";
//     if (tourData.priceDiscount < 0 || tourData.priceDiscount >= tourData.price) newErrors.priceDiscount = "Invalid discount";
//     if (!tourData.summary) newErrors.summary = "Summary is required";
//     if (!tourData.imageCover) newErrors.imageCover = "Cover image is required";
//     if (!tourData.startDates.length) newErrors.startDates = "At least one start date is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTourData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (name === "imageCover") {
//       setTourData((prev) => ({ ...prev, imageCover: files[0] }));
//     } else {
//       setTourData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
//     }
//   };

//   const handleAddStartDate = (e) => {
//     setTourData((prev) => ({ ...prev, startDates: [...prev.startDates, e.target.value] }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       for (const key in tourData) {
//         if (Array.isArray(tourData[key])) {
//           tourData[key].forEach((item) => formData.append(key, item));
//         } else {
//           formData.append(key, tourData[key]);
//         }
//       }

//       const response = await fetch("http://localhost:3000/api/tours", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();
//       if (response.ok) {
//         navigate(`/tour/${result.data.tour._id}`);
//       } else {
//         setErrorMessage(result.message || "Failed to add tour");
//       }
//     } catch (error) {
//       setErrorMessage("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-lg mt-10">
//       <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
//         Add Tour Package
//       </h1>

//       {errorMessage && (
//         <p className="text-red-600 bg-red-100 border border-red-400 rounded-lg px-4 py-2 text-center mb-4">
//           {errorMessage}
//         </p>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {[
//             { label: "Tour Name", name: "name", type: "text" },
//             { label: "Duration (Days)", name: "duration", type: "number" },
//             { label: "Max Group Size", name: "maxGroupSize", type: "number" },
//             { label: "Price ($)", name: "price", type: "number" },
//             { label: "Discount ($)", name: "priceDiscount", type: "number" },
//           ].map((field) => (
//             <div key={field.name}>
//               <label className="block font-bold text-lg">{field.label}</label>
//               <input
//                 type={field.type}
//                 name={field.name}
//                 value={tourData[field.name]}
//                 onChange={handleInputChange}
//                 className={`w-full p-3 mt-2 border ${
//                   errors[field.name] ? "border-red-500" : "border-gray-300"
//                 } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//               />
//               {errors[field.name] && (
//                 <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
//               )}
//             </div>
//           ))}

//           <div>
//             <label className="block font-bold text-lg">Difficulty</label>
//             <select
//               name="difficulty"
//               value={tourData.difficulty}
//               onChange={handleInputChange}
//               className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Difficulty</option>
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//           </div>

//           <div className="col-span-2">
//             <label className="block font-bold text-lg">Summary</label>
//             <textarea
//               name="summary"
//               value={tourData.summary}
//               onChange={handleInputChange}
//               className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Start Dates</label>
//             <input
//               type="date"
//               onChange={handleAddStartDate}
//               className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Cover Image</label>
//             <input
//               type="file"
//               name="imageCover"
//               onChange={handleFileChange}
//               className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Additional Images</label>
//             <input
//               type="file"
//               name="images"
//               multiple
//               onChange={handleFileChange}
//               className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         <div className="mt-6 text-center">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
//           >
//             {loading ? "Adding..." : "Add Tour Package"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddPackages;




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AddPackages = () => {
//   const [tourData, setTourData] = useState({
//     name: "",
//     duration: "",
//     maxGroupSize: "",
//     difficulty: "",
//     price: "",
//     priceDiscount: "",
//     summary: "",
//     description: "",
//     imageCover: null,
//     images: [],
//     startDates: [],
//   });

//   const [errors, setErrors] = useState({});
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};
//     if (!tourData.name.trim()) newErrors.name = "Tour name is required";
//     if (!tourData.duration || tourData.duration <= 0) newErrors.duration = "Duration must be greater than 0";
//     if (!tourData.maxGroupSize || tourData.maxGroupSize <= 0) newErrors.maxGroupSize = "Max group size must be greater than 0";
//     if (!tourData.difficulty) newErrors.difficulty = "Difficulty is required";
//     if (!tourData.price || tourData.price <= 0) newErrors.price = "Price must be greater than 0";
//     if (tourData.priceDiscount < 0 || tourData.priceDiscount >= tourData.price) newErrors.priceDiscount = "Invalid discount";
//     if (!tourData.summary.trim()) newErrors.summary = "Summary is required";
//     if (!tourData.imageCover) newErrors.imageCover = "Cover image is required";
//     if (!tourData.startDates.length) newErrors.startDates = "At least one start date is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTourData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (name === "imageCover") {
//       setTourData((prev) => ({ ...prev, imageCover: files[0] }));
//     } else {
//       setTourData((prev) => ({ ...prev, images: Array.from(files) }));
//     }
//   };

//   const handleAddStartDate = (e) => {
//     const selectedDate = e.target.value;
//     if (selectedDate && !tourData.startDates.includes(selectedDate)) {
//       setTourData((prev) => ({ ...prev, startDates: [...prev.startDates, selectedDate] }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       for (const key in tourData) {
//         if (Array.isArray(tourData[key])) {
//           tourData[key].forEach((item) => formData.append(key, item));
//         } else {
//           formData.append(key, tourData[key]);
//         }
//       }

//       const response = await fetch("http://localhost:3000/api/tours", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();
//       if (response.ok) {
//         navigate(`/tour/${result.data.tour._id}`);
//         setTourData({
//           name: "",
//           duration: "",
//           maxGroupSize: "",
//           difficulty: "",
//           price: "",
//           priceDiscount: "",
//           summary: "",
//           description: "",
//           imageCover: null,
//           images: [],
//           startDates: [],
//         });
//       } else {
//         setErrorMessage(result.message || "Failed to add tour");
//       }
//     } catch (error) {
//       setErrorMessage("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-lg mt-10">
//       <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
//         Add Tour Package
//       </h1>

//       {errorMessage && (
//         <p className="text-red-600 bg-red-100 border border-red-400 rounded-lg px-4 py-2 text-center mb-4">
//           {errorMessage}
//         </p>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {[
//             { label: "Tour Name", name: "name", type: "text" },
//             { label: "Duration (Days)", name: "duration", type: "number" },
//             { label: "Max Group Size", name: "maxGroupSize", type: "number" },
//             { label: "Price ($)", name: "price", type: "number" },
//             { label: "Discount ($)", name: "priceDiscount", type: "number" },
//           ].map((field) => (
//             <div key={field.name}>
//               <label className="block font-bold text-lg">{field.label}</label>
//               <input
//                 type={field.type}
//                 name={field.name}
//                 value={tourData[field.name]}
//                 onChange={handleInputChange}
//                 className={`w-full p-3 mt-2 border ${
//                   errors[field.name] ? "border-red-500" : "border-gray-300"
//                 } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//               />
//               {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
//             </div>
//           ))}

//           <div>
//             <label className="block font-bold text-lg">Difficulty</label>
//             <select
//               name="difficulty"
//               value={tourData.difficulty}
//               onChange={handleInputChange}
//               className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Difficulty</option>
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//           </div>

//           <div className="col-span-2">
//             <label className="block font-bold text-lg">Summary</label>
//             <textarea
//               name="summary"
//               value={tourData.summary}
//               onChange={handleInputChange}
//               className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Start Dates</label>
//             <input
//               type="date"
//               min={new Date().toISOString().split("T")[0]} // Prevent past dates
//               onChange={handleAddStartDate}
//               className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {errors.startDates && <p className="text-red-500 text-sm mt-1">{errors.startDates}</p>}
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Cover Image</label>
//             <input type="file" name="imageCover" onChange={handleFileChange} />
//           </div>

//           <div>
//             <label className="block font-bold text-lg">Additional Images</label>
//             <input type="file" name="images" multiple onChange={handleFileChange} />
//           </div>
//         </div>

//         <div className="mt-6 text-center">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:opacity-50"
//           >
//             {loading ? "Adding..." : "Add Tour Package"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddPackages;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPackages = () => {
  const [tourData, setTourData] = useState({
    name: "",
    duration: "",
    maxGroupSize: "",
    difficulty: "",
    price: "",
    priceDiscount: "",
    summary: "",
    description: "",
    imageCover: null,
    images: [],
    startDates: [],
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!tourData.name.trim()) newErrors.name = "Tour name is required";
    if (!tourData.duration || tourData.duration <= 0) newErrors.duration = "Duration must be greater than 0";
    if (!tourData.maxGroupSize || tourData.maxGroupSize <= 0) newErrors.maxGroupSize = "Max group size must be greater than 0";
    if (!tourData.difficulty) newErrors.difficulty = "Difficulty is required";
    if (!tourData.price || tourData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (tourData.priceDiscount < 0 || tourData.priceDiscount >= tourData.price) newErrors.priceDiscount = "Invalid discount";
    if (!tourData.summary.trim()) newErrors.summary = "Summary is required";
    if (!tourData.imageCover) newErrors.imageCover = "Cover image is required";
    if (!tourData.startDates.length) newErrors.startDates = "At least one start date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTourData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "imageCover") {
      setTourData((prev) => ({ ...prev, imageCover: files[0] }));
    } else {
      setTourData((prev) => ({ ...prev, images: Array.from(files) }));
    }
  };

  const handleAddStartDate = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate && !tourData.startDates.includes(selectedDate)) {
      setTourData((prev) => ({ ...prev, startDates: [...prev.startDates, selectedDate] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in tourData) {
        if (Array.isArray(tourData[key])) {
          tourData[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, tourData[key]);
        }
      }

      const response = await fetch("http://localhost:3000/api/tours", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        navigate(`/tour/${result.data.tour._id}`);
        setTourData({
          name: "",
          duration: "",
          maxGroupSize: "",
          difficulty: "",
          price: "",
          priceDiscount: "",
          summary: "",
          description: "",
          imageCover: null,
          images: [],
          startDates: [],
        });
      } else {
        setErrorMessage(result.message || "Failed to add tour");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 shadow-lg rounded-lg mt-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Add Tour Package</h1>

      {errorMessage && (
        <p className="text-red-600 bg-red-100 border border-red-400 rounded-lg px-4 py-2 text-center mb-4">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Tour Name", name: "name", type: "text" },
            { label: "Duration (Days)", name: "duration", type: "number" },
            { label: "Max Group Size", name: "maxGroupSize", type: "number" },
            { label: "Price ($)", name: "price", type: "number" },
            { label: "Discount ($)", name: "priceDiscount", type: "number" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block font-semibold text-lg text-gray-700">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={tourData[field.name]}
                onChange={handleInputChange}
                className={`w-full p-3 mt-2 border ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
            </div>
          ))}

          <div>
            <label className="block font-semibold text-lg text-gray-700">Difficulty</label>
            <select
              name="difficulty"
              value={tourData.difficulty}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-lg text-gray-700">Start Dates</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              onChange={handleAddStartDate}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-500 text-sm mt-1">* You can only select future dates.</p>
            {errors.startDates && <p className="text-red-500 text-sm mt-1">{errors.startDates}</p>}
          </div>

          <div>
            <label className="block font-semibold text-lg text-gray-700">Cover Image</label>
            <input type="file" name="imageCover" onChange={handleFileChange} className="w-full p-2 mt-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block font-semibold text-lg text-gray-700">Additional Images</label>
            <input type="file" name="images" multiple onChange={handleFileChange} className="w-full p-2 mt-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:bg-blue-700 transition transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Tour Package"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPackages;











