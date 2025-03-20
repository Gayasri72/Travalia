import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative w-full bg-gray-100 py-16 px-6 lg:px-20 flex flex-col-reverse lg:flex-row items-center justify-between">
      {/* Left Side - Text Section */}
      <div className="lg:w-1/2 text-center lg:text-left space-y-6">
      <h1 className='bg-cyan-500 '>Know before you go</h1>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Traveling open the door to creating{' '}
          <span className="text-blue-500">memories</span>
        </h1>
        <p className="text-lg text-gray-600">
          Discover breathtaking locations, unique cultures, and unforgettable
          experiences.
        </p>
        <Link to='/tours' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ">
          Explore Now
        </Link>
      </div>

      {/* Right Side - Image & Video Section */}
      <div className="lg:w-1/2 grid grid-cols-2 gap-4 lg:gap-6">
        {/* Image Panel 1 */}
        <div className="relative">
          <img
            src="https://img.freepik.com/free-photo/beautiful-girl-sitting-viewpoint-koh-nangyuan-island-near-koh-tao-island-surat-thani-thailand_335224-1093.jpg?ga=GA1.1.1305975420.1709091022&semt=ais_hybrid"
            alt="Travel 1"
            className="rounded-lg shadow-lg object-cover w-60 h-72"
          />
        </div>

        {/* Image Panel 2 & Video Panel */}
        <div className="flex flex-col space-y-4">
          {/* Image Panel 2 */}
          <img
            src="https://img.freepik.com/premium-photo/asian-woman-travel-relax-view-map-travel-explore_36074-72.jpg?ga=GA1.1.1305975420.1709091022&semt=ais_hybrid"
            alt="Travel 2"
            className="rounded-lg shadow-lg object-cover w-60 h-72"
          />

          {/* Video Panel */}
          <div className="relative w-60 h-72 sm:h-64 rounded-lg overflow-hidden shadow-lg">
            <video
              className="w-60 h-72 object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                type="video/mp4"
              />
            </video>
            {/* Play Button Overlay (Optional) */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <span className="text-white text-3xl font-bold">▶</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
