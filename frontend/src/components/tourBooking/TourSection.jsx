import { useQuery } from '@tanstack/react-query';
import { FaMapMarkerAlt, FaCalendarAlt, FaFlag, FaUserFriends } from 'react-icons/fa';


const fetchTours = async () => {
  const response = await fetch('http://localhost:3000/api/tours');
  const data = await response.json();
  if (!data.success) throw new Error('Failed to fetch tours');
  return data.data.tours.slice(0,6); // Ensure it returns an array
};

const TourSection = () => {
  const { data: tours = [], isLoading, error } = useQuery({
    queryKey: ['tours'],
    queryFn: fetchTours,
  });
  console.log(tours)

  if (isLoading) return <span>Loading tours...</span>;
  if (error) return <span>Error: {error.message}</span>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Available Tours</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div key={tour._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Image Section with Overlay */}
            <div className="relative">
              <img
                src={tour.imageCover || 'https://img.freepik.com/free-photo/tourist-reading-book_1368-7034.jpg'}
                alt={tour.name || 'Tour Image'}
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <h2 className="absolute bottom-5 left-5 text-white text-lg font-bold bg-blue-500 px-3 py-1 rounded-md">
                {tour.name}
              </h2>
            </div>

            {/* Tour Details Section */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">{tour.duration}-Day Tour-{tour.difficulty}</h3>
              <p className="text-gray-600 text-sm mb-4">{tour.summary}</p>

              {/* Icons and Info */}
              <div className="flex items-center text-gray-500 text-sm space-x-4 mb-4">
                <p className="flex items-center">
                  <FaMapMarkerAlt className="mr-1 text-blue-500" /> {tour.location}
                </p>
                <p className="flex items-center">
                  <FaCalendarAlt className="mr-1 text-blue-500" /> {tour.date}
                </p>
              </div>
              <div className="flex items-center text-gray-500 text-sm space-x-4 mb-4">
                <p className="flex items-center">
                  <FaFlag className="mr-1 text-blue-500" /> {tour.stops} stops
                </p>
                <p className="flex items-center">
                  <FaUserFriends className="mr-1 text-blue-500" /> {tour.maxGroupSize} people
                </p>
              </div>

              {/* Price & Rating */}
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-bold text-lg">${tour.price} <span className="text-sm text-gray-500">per person</span></p>
                <p className="text-gray-500 text-sm">⭐ {tour.ratingsAverage} ({tour.ratingsQuantity} reviews)</p>
              </div>

              {/* Button */}
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600">
                DETAILS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourSection;