import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function HireDetails() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [dropDetails, setDropDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) {
      setError('Email is missing.');
      setLoading(false);
      return;
    }

    const fetchDropDetails = async () => {
      try {
        const response = await axios.get(`/api/drop/user/${email}`);
        setDropDetails(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch drop details');
      } finally {
        setLoading(false);
      }
    };

    fetchDropDetails();
  }, [email]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Drop Details</h1>
      {dropDetails.length === 0 ? (
        <p>No drop details found.</p>
      ) : (
        <ul className="space-y-4">
          {dropDetails.map((drop) => (
            <li key={drop._id} className="border p-4 rounded shadow">
              <p><strong>Pickup Location:</strong> {drop.pickupLocation}</p>
              <p><strong>Drop Location:</strong> {drop.dropLocation}</p>
              <p><strong>Date & Time:</strong> {new Date(drop.dateTime).toLocaleString()}</p>
              <p><strong>Vehicle:</strong> {drop.vehicleName}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}