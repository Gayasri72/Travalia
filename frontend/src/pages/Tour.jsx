import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { FaStar, FaChartLine, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign } from 'react-icons/fa';
import Reviews from '../components/home/reviews';

const fetchTour = async (tourId) => {
  const response = await fetch(`http://localhost:3000/api/tours/${tourId}`);
  const data = await response.json();
  if (!data.success) throw new Error('Failed to fetch tour details');
  return data.data.tour;
};

const Tour = () => {
  const { id } = useParams();
  const { data: tour, isLoading, error } = useQuery({
    queryKey: ['tour', id],
    queryFn: () => fetchTour(id),
  });

  if (isLoading) return <p className="text-center text-lg">Loading tour details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg ">
      {/* Hero Section */}
      <div className="relative w-full h-96">
        <img
          src={`../src/assets/tours/${tour.imageCover}`}
          alt={tour.name}
          className="w-full h-full object-cover rounded-lg"
        />
        <h1 className="absolute bottom-4 left-4 text-white text-3xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
          {tour.name}
        </h1>
      </div>

      {/* Tour Details */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        {/* Left: Ratings, Difficulty, Guides */}
        <div>
          <p className="text-lg font-bold flex items-center">
            <FaStar className="text-yellow-500 mr-2" /> {tour.ratingsAverage} ({tour.ratingsQuantity} reviews)
          </p>
          <p className="text-lg font-bold flex items-center mt-2">
            <FaChartLine className="text-blue-500 mr-2" /> Difficulty: {tour.difficulty}
          </p>
          <p className="text-lg font-bold flex items-center mt-2">
            <FaUsers className="text-blue-500 mr-2" /> Tour Guides: {tour.guides ? tour.guides.length : 'N/A'}
          </p>
          <p>Meet Your Guides</p>
       
        </div>

        {/* Right: Description */}
        <div>
          <p className="text-gray-700">{tour.description}</p>
        </div>
      </div>

      {/* Tour Gallery */}
      <h2 className="text-2xl font-bold mt-6 mb-4">Tour Gallery</h2>
      <div className="grid grid-cols-3 gap-2">
        {tour.images.slice(0, 3).map((img, index) => (
          <img
            key={index}
            src={`../src/assets/tours/${img}`}
            alt={`Tour image ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg shadow-md"
          />
        ))}
      </div>

      {/* Map Section */}
      <h2 className="text-2xl font-bold mt-6 mb-4">Tour Locations</h2>
      <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded-lg">
        <p className="text-gray-700">Map Placeholder (Integrate Google Maps API)</p>
      </div>

      {/* Review Section */}
      <h2 className="text-2xl font-bold mt-6 mb-4">Customer Reviews</h2>
      <Reviews/>

      {/* Booking Button */}
      <div className="mt-6 text-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:bg-blue-700">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Tour;
