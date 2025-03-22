import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="flex items-center justify-center px-4 md:px-10 py-6">
      <div className="relative w-full max-w-2xl">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Places to go, things to do, hotels..."
          className="w-full py-3 pl-10 pr-20 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Search Icon */}
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={20}
        />

        {/* Search Button */}
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-400 hover:bg-blue-500 text-black font-semibold px-6 py-2 rounded-full transition">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
