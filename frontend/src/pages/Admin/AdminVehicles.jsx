import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const customStyles = `
  .admin-vehicles-container {
    background: linear-gradient(135deg, #f6f8fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 2rem 0;
  }
  
  .content-wrapper {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 2rem;
    margin: 0 auto;
    max-width: 1200px;
  }
  
  .form-container {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .table-container {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .table-container table {
    width: 100%;
  }
  
  .table-container th {
    background-color: #f8fafc;
    padding: 1rem;
    text-align: center;
    font-weight: 600;
  }
  
  .table-container td {
    padding: 1rem;
    text-align: center;
  }
  
  .action-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ name: "", passengers: "", baggage: "" });
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [editVehicleData, setEditVehicleData] = useState({ name: "", passengers: "", baggage: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/vehicles");
      setVehicles(response.data.data.vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Failed to fetch vehicles"); // Set error message
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!newVehicle.name || !newVehicle.passengers || !newVehicle.baggage) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post("/api/vehicles", newVehicle);
      setVehicles((prev) => [...prev, response.data.data.vehicle]);
      setNewVehicle({ name: "", passengers: "", baggage: "" });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle");
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/vehicles/${id}`);
        setVehicles((prev) => prev.filter((vehicle) => vehicle._id !== id));
        alert('Vehicle deleted successfully!');
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        alert("Failed to delete vehicle");
      }
    }
  };

  const handleEditClick = (vehicle) => {
    setEditVehicleId(vehicle._id);
    setEditVehicleData({
      name: vehicle.name,
      passengers: vehicle.passengers,
      baggage: vehicle.baggage,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/vehicles/${id}`, editVehicleData);
      setVehicles((prev) => prev.map((v) => (v._id === id ? response.data.data.vehicle : v)));
      setEditVehicleId(null);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      alert("Failed to update vehicle");
    }
  };

  const handleCancelEdit = () => {
    setEditVehicleId(null);
  };

  const generateReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Vehicle Management Report', 14, 22);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add table
    autoTable(doc, {
      startY: 40,
      head: [['Vehicle Name', 'Passengers', 'Baggage Capacity']],
      body: vehicles.map(vehicle => [
        vehicle.name,
        vehicle.passengers,
        vehicle.baggage
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      }
    });

    // Save the PDF
    doc.save('vehicle-report.pdf');
  };

  return (
    <div className="admin-vehicles-container">
      <div className="content-wrapper">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Vehicles</h2>
          <button
            onClick={generateReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            Generate Report
          </button>
        </div>

        {/* Add Vehicle Form */}
        <div className="form-container">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Vehicle Name"
              value={newVehicle.name}
              onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
              className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Passengers"
              value={newVehicle.passengers}
              onChange={(e) => setNewVehicle({ ...newVehicle, passengers: e.target.value })}
              className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Baggage Capacity"
              value={newVehicle.baggage}
              onChange={(e) => setNewVehicle({ ...newVehicle, baggage: e.target.value })}
              className="border p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddVehicle}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Vehicle
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Vehicles Table */}
        <div className="table-container">
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center text-gray-500">Loading vehicles...</p>
            ) : vehicles.length > 0 ? (
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr>
                    <th>Vehicle Name</th>
                    <th>Passengers</th>
                    <th>Baggage</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="border-b hover:bg-gray-50">
                      {editVehicleId === vehicle._id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              name="name"
                              value={editVehicleData.name}
                              onChange={handleEditChange}
                              className="border p-1 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="passengers"
                              value={editVehicleData.passengers}
                              onChange={handleEditChange}
                              className="border p-1 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="baggage"
                              value={editVehicleData.baggage}
                              onChange={handleEditChange}
                              className="border p-1 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="action-buttons">
                            <button
                              onClick={() => handleSaveEdit(vehicle._id)}
                              className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded transition-colors duration-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{vehicle.name}</td>
                          <td>{vehicle.passengers}</td>
                          <td>{vehicle.baggage}</td>
                          <td className="action-buttons">
                            <button
                              onClick={() => handleEditClick(vehicle)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded transition-colors duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(vehicle._id)}
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">No vehicles found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
