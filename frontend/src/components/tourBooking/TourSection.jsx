import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
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

const SkeletonCard = () => (
  <div className="animate-pulse bg-white shadow rounded-lg overflow-hidden flex flex-col">
    <div className="bg-gray-200 h-48 w-full" />
    <div className="p-6 flex-1 flex flex-col gap-2">
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-1/4 mt-2" />
    </div>
  </div>
);

const TourSection = () => {
  const [difficultyFilter, setDifficultyFilter] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

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

  const { tours = [], totalPages = 2 } = data || {}; // Adjusted destructuring for `tours` and `totalPages`

  const handleFilterChange = (value) => {
    setDifficultyFilter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pt-8 border-t min-h-screen bg-gray-50">
      {/* Filter Sidebar - collapsible on mobile */}
      <div className="lg:min-w-60 w-full lg:w-auto mb-4 lg:mb-0">
        <button
          className="flex items-center gap-2 text-lg font-semibold lg:hidden mb-2 px-4 py-2 bg-white rounded shadow border border-gray-200 w-full justify-between"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <span className="flex items-center gap-2">
            <FaFilter /> Filters
          </span>
          {showFilters ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <div
          className={`transition-all duration-300 ${showFilters ? 'max-h-96' : 'max-h-0 overflow-hidden'} lg:max-h-full lg:block bg-white rounded shadow border border-gray-200 px-6 py-4`}
        >
          <p className="mb-3 text-base font-semibold text-gray-700">
            Categories
          </p>
          <div className="flex flex-col gap-3 text-sm font-medium text-gray-700">
            {['easy', 'medium', 'difficult'].map((level) => (
              <label
                key={level}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={difficultyFilter.includes(level)}
                  onChange={() => handleFilterChange(level)}
                  className="accent-blue-500"
                />
                <span className="capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Tour List */}
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center sm:text-left">
            Our{' '}
            <span className="underline underline-offset-4 decoration-blue-500 font-light">
              Tours
            </span>
          </h1>
          <div className="relative w-full sm:w-auto">
            <select
              className="appearance-none border-2 border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full sm:w-56 bg-white shadow"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort by: Default</option>
              <option value="price">Price (Low to High)</option>
              <option value="-price">Price (High to Low)</option>
              <option value="ratingsAverage">Ratings (High to Low)</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <FaChevronDown />
            </span>
          </div>
        </div>

        {/* Tour Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : tours.length > 0 ? (
            tours.map((tour) => (
              <div
                key={tour._id}
                className="group bg-white shadow-lg rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={`src/assets/tours/${tour.imageCover}`}
                    alt={tour.name || 'Tour Image'}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <h2 className="absolute bottom-4 left-4 text-white text-lg font-bold px-3 py-1 bg-black/40 rounded">
                    {tour.name}
                  </h2>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-blue-500 uppercase mb-1 tracking-wide">
                      {tour.duration}-Day Tour • {tour.difficulty}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {tour.summary}
                    </p>
                    <div className="flex flex-col gap-1 mb-3">
                      {tour.locations && tour.locations.length > 0 && (
                        <div className="flex items-start gap-2 text-xs text-gray-700">
                          <FaMapMarkerAlt className="text-blue-500 mt-0.5" />
                          <div>
                            <span className="font-semibold">Locations:</span>
                            <ul className="ml-2 list-disc">
                              {tour.locations.slice(0, 3).map((loc, idx) => (
                                <li key={idx} className="text-gray-600">
                                  {loc.description || `Location ${idx + 1}`}
                                </li>
                              ))}
                              {tour.locations.length > 3 && (
                                <li className="text-gray-400">...and more</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <FaCalendarAlt className="text-blue-500" />
                        {tour.startDates?.[0] || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <p className="text-gray-800 font-bold text-lg">
                      ${tour.price}{' '}
                      <span className="text-xs text-gray-500 font-normal">
                        per person
                      </span>
                    </p>
                    <p className="text-gray-500 text-xs mb-1">
                      ⭐ {tour.ratingsAverage} ({tour.ratingsQuantity} reviews)
                    </p>
                    <Link
                      to={`/tour/${tour._id}`}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg w-full text-center font-semibold hover:bg-blue-600 transition-colors"
                    >
                      DETAILS
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">
              No tours available.
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg font-semibold border border-gray-300 bg-white shadow-sm transition-colors ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}
          >
            Previous
          </button>
          <span className="mx-2 text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg font-semibold border border-gray-300 bg-white shadow-sm transition-colors ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourSection;
