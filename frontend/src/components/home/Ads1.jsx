import React from "react";
import { Link } from "react-router-dom";

const Ads1 = () => {
  return (
    <div className="bg-blue-100 p-6 flex flex-col md:flex-row items-center justify-center rounded-lg">
      {/* Image Section */}
      <div className="md:w-1/2">
        <img
          src="src/assets/home/images4.jpg" // Replace with actual image source
          alt="Woman holding a dog"
          className="rounded-lg shadow-md w-full"
        />
      </div>

      {/* Text Content */}
      <div className="md:w-1/2 p-6 text-center md:text-left">
        <p className="text-gray-600 text-sm flex items-center justify-center md:justify-start">
          <span className="mr-2">🟢</span> Sponsored by{" "}
          <a href="#" className="text-blue-600 font-semibold ml-1">
            CESAR®
          </a>
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mt-3">
          It’s easier than ever to go together
        </h2>
        <p className="text-gray-700 text-sm mt-3 mb-3">
          Travel is better when you can share it with your best friend. Find all
          the tips, guides, and tools you need to take a dream trip with your
          dog.
        </p>
        <Link to='/gallery' className="mt-5 bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800">
          Explore more
        </Link>
      </div>
    </div>
  );
};

export default Ads1;
