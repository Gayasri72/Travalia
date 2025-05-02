import React, { useState } from 'react';
import Pick from '../components/Hire/Pick';
import Drop from '../components/Hire/Drop';

const HireDetailsComponent = () => {
  const [serviceType, setServiceType] = useState('pickup'); // 'pickup' or 'drop'

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('src/assets/hires/airport-background.webp')", // Make sure this image exists in your public/images folder
      }}
    >
      {/* Overlay for readability */}
      <div className="bg-white bg-opacity-20 min-h-screen">
        <div className="max-w-4xl mx-auto my-8 p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Book Your Ride</h2>

          {/* Service Type Selection */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setServiceType('pickup')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                serviceType === 'pickup'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pickup Service
            </button>
            <button
              onClick={() => setServiceType('drop')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                serviceType === 'drop'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Drop Service
            </button>
          </div>

          {/* Form Display */}
          <div className="transition-all duration-300">
            {serviceType === 'pickup' ? <Pick /> : <Drop />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HireDetailsComponent;
