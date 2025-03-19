import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFlag,
  FaUserFriends,
} from 'react-icons/fa';
import { Link,  } from 'react-router-dom';

const fetchTours = async () => {
  const response = await fetch('http://localhost:3000/api/tours');
  const data = await response.json();
  if (!data.success) throw new Error('Failed to fetch tours');
  return data.data.tours.slice(0, 6);
};

const TourSection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const {
    data: tours = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tours'],
    queryFn: fetchTours,
  });

  if (isLoading) return <span>Loading tours...</span>;
  if (error) return <span>Error: {error.message}</span>;

  return (
    <div className="flex flex-col sm:flex-row gap-10 pt-10 border-t">
      {/* Filter options */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
          FILTERS
        </p>
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Easy'} /> Easy
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Medium'} /> Medium
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Hard'} /> Hard
            </p>
          </div>
        </div>
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Mountains'} />{' '}
              Mountains
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Beaches'} />{' '}
              Beaches
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={'Forests'} />{' '}
              Forests
            </p>
          </div>
        </div>
      </div>
      {/* Right side */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-center flex-1">
            Our{' '}
            <span className="underline underline-offset-4 decoration-1 font-light">
              Tours
            </span>
          </h1>
          <select className="border-2 border-gray-300 text-sm px-2">
            <option value="relevent">Sort by: Relevent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* Tour cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 gap-y-6">
          {tours.map((tour) => (
            <div
              key={tour._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={
                    
                    'https://img.freepik.com/free-photo/woman-bikini-sitting-viewpoint-nang-yuan-island-thailand_335224-1091.jpg?ga=GA1.1.1305975420.1709091022&semt=ais_hybrid'
                  }
                  alt={tour.name || 'Tour Image'}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <h2 className="absolute bottom-5 left-5 text-white text-lg font-bold  px-3 py-1 ">
                  {tour.name}
                </h2>
              </div>
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  {tour.duration}-Day Tour-{tour.difficulty}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{tour.summary}</p>
                <div className="flex items-center text-gray-500 text-sm space-x-4 mb-4">
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-1 text-blue-500" />{' '}
                    {tour.location}
                  </p>
                  <p className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-blue-500" /> {tour.startDates[0]}
                  </p>
                </div>
                <div className="flex items-center text-gray-500 text-sm space-x-4 mb-4">
                  <p className="flex items-center">
                    <FaFlag className="mr-1 text-blue-500" /> {tour.stops} stops
                  </p>
                  <p className="flex items-center">
                    <FaUserFriends className="mr-1 text-blue-500" />{' '}
                    {tour.maxGroupSize} people
                  </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-700 font-bold text-lg">
                    ${tour.price}{' '}
                    <span className="text-sm text-gray-500">per person</span>
                  </p>
                  <p className="text-gray-500 text-sm">
                    ⭐ {tour.ratingsAverage} ({tour.ratingsQuantity} reviews)
                  </p>
                </div>
                <Link to='/tour' className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600">
                  DETAILS
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourSection;
