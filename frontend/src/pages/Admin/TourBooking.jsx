// import React from 'react'

// function TourBooking() {
//     const orders = [
//         { name: "John Doe", email: "john@example.com", phone: "123-456-7890", doctor: "Dr. Smith", quantity: 2, status: "Pending" },
//         { name: "Alice Brown", email: "alice@example.com", phone: "987-654-3210", doctor: "Dr. Jane", quantity: 1, status: "Completed" },
//         { name: "Michael Lee", email: "michael@example.com", phone: "456-789-1230", doctor: "Dr. Alex", quantity: 3, status: "Pending" },
//       ];
//   return (
//     <div>
//       <div className="mt-6 bg-white p-6 shadow-lg rounded-lg">
//       <h2 className="text-lg font-semibold mb-4 text-gray-900">Pharmacy Orders</h2>

//       <table className="w-full">
//         <thead>
//           <tr className="bg-blue-100 text-left text-gray-700">
//             <th className="p-3">Patient Name</th>
//             <th className="p-3">Email</th>
//             <th className="p-3">Phone</th>
//             <th className="p-3">Doctor Name</th>
//             <th className="p-3">Quantity</th>
//             <th className="p-3">Status</th>
//             <th className="p-3">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {orders.map((order, index) => (
//             <tr key={index} className="text-left hover:bg-gray-100">
//               <td className="p-3">{order.name}</td>
//               <td className="p-3">{order.email}</td>
//               <td className="p-3">{order.phone}</td>
//               <td className="p-3">{order.doctor}</td>
//               <td className="p-3">{order.quantity}</td>
//               <td className={`p-3 font-semibold ${order.status === "Completed" ? "text-green-600" : "text-red-500"}`}>
//                 {order.status}
//               </td>
//               <td className="p-3 flex gap-2">
//                 <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
//                   Done
//                 </button>
//                 <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
//                   View
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//     </div>
//   )
// }

// export default TourBooking