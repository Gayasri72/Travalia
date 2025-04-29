import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HireDetails() {
  const [hires, setHires] = useState([]);

  useEffect(() => {
    const fetchHires = async () => {
      try {
        const response = await axios.get('/api/drop//drop-booking');
        setHires(response.data.data);
      } catch (error) {
        console.error('Error fetching booking hires:', error);
      }
    };

    fetchHires();
  }, []);

  return (
    <div>
      <h1>Booking Hires</h1>
      <ul>
        {hires.map((hire) => (
          <li key={hire._id}>
            <p>Customer Name: {hire.customerName}</p>
            <p>Email: {hire.email}</p>
            <p>Phone No: {hire.phoneNo}</p>
            <p>Pickup Location: {hire.pickupLocation}</p>
            <p>Drop Location: {hire.dropLocation}</p>
            <p>Date & Time: {hire.dateTime}</p>
            <p>Vehicle Name: {hire.vehicleName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HireDetails;