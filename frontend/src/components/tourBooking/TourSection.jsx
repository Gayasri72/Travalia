import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const fetchTours = async ({ queryKey }) => {
  const [_key, filters] = queryKey;
  const { difficulty, sort, page } = filters;

  const queryParams = new URLSearchParams();
  if (difficulty.length > 0)
    queryParams.append('difficulty', difficulty.join(','));
  if (sort) queryParams.append('sort', sort);
  if (page) queryParams.append('page', page);

  const response = await fetch(
    `http://localhost:3000/api/tours?${queryParams.toString()}`,
  );
  const data = await response.json();

  if (!data.success) throw new Error('Failed to fetch tours');
  return data.data; // Adjusted to return data directly
};

const TourSection = () => {
  const [difficultyFilter, setDifficultyFilter] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'tours',
      { difficulty: difficultyFilter, sort: sortOption, page },
    ],
    queryFn: fetchTours,
  });

  console.log('Fetched data:', data);

  if (isLoading) return <span>Loading tours...</span>;
  if (error) return <span>Error: {error.message}</span>;

  const { tours = [], totalPages = 1 } = data || {}; // Adjusted destructuring for `tours` and `totalPages`

  const handleFilterChange = (value) => {
    setDifficultyFilter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-10 pt-10 border-t">
      {/* Filter Sidebar */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
          FILTERS
        </p>
        <div className="border border-gray-300 pl-5 py-3 mt-6">
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {['Easy', 'Medium', 'Difficult'].map((level) => (
              <label key={level} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={difficultyFilter.includes(level)}
                  onChange={() => handleFilterChange(level)}
                />
                {level}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Tour List */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-center flex-1">
            Our{' '}
            <span className="underline underline-offset-4 decoration-1 font-light">
              Tours
            </span>
          </h1>
          <select
            className="border-2 border-gray-300 text-sm px-2"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort by: Default</option>
            <option value="price">Sort by: Price (Low to High)</option>
            <option value="-price">Sort by: Price (High to Low)</option>
            <option value="ratingsAverage">
              Sort by: Ratings (High to Low)
            </option>
          </select>
        </div>

        {/* Tour Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 gap-y-6">
          {tours.length > 0 ? (
            tours.map((tour) => (
              <div
                key={tour._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={`src/assets/tours/${tour.imageCover}`}
                    alt={tour.name || 'Tour Image'}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <h2 className="absolute bottom-5 left-5 text-white text-lg font-bold px-3 py-1">
                    {tour.name}
                  </h2>
                </div>
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    {tour.duration}-Day Tour - {tour.difficulty}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{tour.summary}</p>
                  <div className="flex items-center text-gray-500 text-sm space-x-4 mb-4">
                    <p className="flex items-center">
                      <FaMapMarkerAlt className="mr-1 text-blue-500" />{' '}
                      {tour.location}
                    </p>
                    <p className="flex items-center">
                      <FaCalendarAlt className="mr-1 text-blue-500" />{' '}
                      {tour.startDates?.[0] || 'N/A'}
                    </p>
                  </div>
                  <p className="text-gray-700 font-bold text-lg">
                    ${tour.price}{' '}
                    <span className="text-sm text-gray-500">per person</span>
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    ⭐ {tour.ratingsAverage} ({tour.ratingsQuantity} reviews)
                  </p>
                  <Link
                    to={`/tour/${tour._id}`}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 "
                  >
                    DETAILS
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No tours available.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourSection;
