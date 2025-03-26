// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const TourPackages = () => {
//   const [tourPackages, setTourPackages] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPackages = async () => {
//         try {
//           const response = await fetch('http://localhost:3000/api/tours');
//           const data = await response.json();
//           console.log(data); // Log the full response to inspect its structure
          
//           // Accessing the tours array inside the data object
//           if (Array.isArray(data.data.tours)) {
//             setTourPackages(data.data.tours);
//           } else {
//             setErrorMessage('Invalid data format received');
//           }
//         } catch (error) {
//           setErrorMessage('An error occurred while fetching packages');
//         }
//       };
      
      
//     fetchPackages();
//   }, []);

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this package?')) {
//       try {
//         const response = await fetch(`http://localhost:3000/api/tours/${id}`, {
//           method: 'DELETE',
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setTourPackages(tourPackages.filter((tour) => tour._id !== id)); // Update state after deletion
//         } else {
//           setErrorMessage(data.message || 'Failed to delete package');
//         }
//       } catch (error) {
//         setErrorMessage('deleted sucessfully');
//       }
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h1 className="text-3xl font-bold mb-4">Tour Packages</h1>

//       {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

//       <div className="mb-6 text-center">
//         <Link
//           to="/admin/addpackages"
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:bg-blue-700"
//         >
//           Add New Tour Package
//         </Link>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-6 py-3 text-left">Tour Name</th>
//               <th className="px-6 py-3 text-left">Duration (days)</th>
//               <th className="px-6 py-3 text-left">Price</th>
//               <th className="px-6 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(tourPackages) && tourPackages.length > 0 ? (
//               tourPackages.map((tour) => (
//                 <tr key={tour._id} className="border-b">
//                   <td className="px-6 py-3">{tour.name}</td>
//                   <td className="px-6 py-3">{tour.duration}</td>
//                   <td className="px-6 py-3">${tour.price}</td>
//                   <td className="px-6 py-3">
//                     <button
//                       onClick={() => navigate(`/admin/packages/edit/${tour._id}`)}
//                       className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(tour._id)}
//                       className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="px-6 py-3 text-center">
//                   No packages found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TourPackages;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TourPackages = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tours');
        const data = await response.json();
        
        if (Array.isArray(data.data.tours)) {
          setTourPackages(data.data.tours);
        } else {
          setErrorMessage('Invalid data format received');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching packages');
      }
    };
      
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/tours/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setTourPackages(tourPackages.filter((tour) => tour._id !== id));
        } else {
          setErrorMessage('Failed to delete package');
        }
      } catch (error) {
        setErrorMessage('An error occurred while deleting');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Tour Packages</h1>

      {errorMessage && (
        <p className="text-red-600 text-center bg-red-100 p-3 rounded-md mb-4">
          {errorMessage}
        </p>
      )}

      <div className="flex justify-center mb-6">
        <Link
          to="/admin/addpackages"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300 hover:bg-blue-700"
        >
          + Add New Tour Package
        </Link>
      </div>

      <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md">
        <table className="min-w-full table-auto text-gray-700">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm tracking-wider">
              <th className="px-6 py-4 text-left">Tour Name</th>
              <th className="px-6 py-4 text-left">Duration (days)</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tourPackages.length > 0 ? (
              tourPackages.map((tour) => (
                <tr key={tour._id} className="border-b hover:bg-gray-100 transition">
                  <td className="px-6 py-4 font-medium">{tour.name}</td>
                  <td className="px-6 py-4">{tour.duration}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">${tour.price}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/admin/packages/edit/${tour._id}`)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 transition hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tour._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg transition hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No packages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TourPackages;

