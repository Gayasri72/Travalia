// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaEnvelope, FaPhone, FaDollarSign } from "react-icons/fa";
// import axios from "axios";
// import backhire from '../../assets/hires/backhire.jpg';

// export default function BookingForm() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     passengerName: "",
//     email: "",
//     phone: "",
//   });

//   const fakePrice = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("/api/hires", {
//         passengerName: formData.passengerName,
//         email: formData.email,
//         phone: formData.phone,
//         price: fakePrice,
//       });

//       if (response.status === 201) {
//         alert("Booking successful!");
//         navigate("/");
//       } else {
//         alert("Failed to book. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error booking hire:", error);
//       alert("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div
//       className="flex items-center justify-center min-h-screen bg-cover bg-center"
//       style={{ backgroundImage: `url(${backhire})` }}
//     >
//       <form
//         className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
//         onSubmit={handleSubmit}
//       >
//         <h2 className="text-2xl font-semibold text-center text-gray-700">Booking Form</h2>

//         {/* Passenger Name Input */}
//         <label className="block text-gray-700 font-semibold mt-4">Passenger Name</label>
//         <div className="flex items-center border border-gray-300 p-3 rounded-lg focus-within:border-blue-500">
//           <FaUser className="text-gray-500 mr-3" />
//           <input
//             type="text"
//             name="passengerName"
//             value={formData.passengerName}
//             onChange={handleChange}
//             className="w-full outline-none"
//             placeholder="Enter Name"
//             required
//           />
//         </div>

//         {/* Email Input */}
//         <label className="block text-gray-700 font-semibold mt-4">Email</label>
//         <div className="flex items-center border border-gray-300 p-3 rounded-lg focus-within:border-blue-500">
//           <FaEnvelope className="text-gray-500 mr-3" />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full outline-none"
//             placeholder="Enter Email"
//             required
//           />
//         </div>

//         {/* Phone Number Input */}
//         <label className="block text-gray-700 font-semibold mt-4">Phone Number</label>
//         <div className="flex items-center border border-gray-300 p-3 rounded-lg focus-within:border-blue-500">
//           <FaPhone className="text-gray-500 mr-3" />
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className="w-full outline-none"
//             placeholder="Enter Phone"
//             required
//           />
//         </div>

//         {/* Estimated Price Display */}
//         <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mt-4">
//           <span className="text-gray-700 font-semibold">Estimated Price:</span>
//           <span className="text-lg text-green-600 font-bold flex items-center">
//             <FaDollarSign className="mr-1" /> LKR {fakePrice}
//           </span>
//         </div>

//         {/* Book Now Button */}
//         <button
//           type="submit"
//           className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-300"
//         >
//           Book Now
//         </button>
//       </form>
//     </div>
//   );
// }
