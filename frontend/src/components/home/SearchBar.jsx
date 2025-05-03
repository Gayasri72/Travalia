import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Destination Search */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MapPin className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {/* Date Picker */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Calendar className="w-5 h-5" />
            </div>
            <input
              type="date"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* People Count */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Users className="w-5 h-5" />
            </div>
            <input
              type="number"
              placeholder="How many people?"
              min="1"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Search Button */}
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>

        {/* Popular Searches */}
        {isFocused && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Popular Destinations
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Paris', 'Tokyo', 'New York', 'Bali', 'London', 'Dubai'].map((destination) => (
                <button
                  key={destination}
                  className="px-3 py-1 text-sm bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                >
                  {destination}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;
