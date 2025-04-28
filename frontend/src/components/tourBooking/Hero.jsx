import React from 'react';
import { Link } from 'react-router-dom';
// import {hero1} from '../../assets/tourBooking/hero1.jpg';

export default function Hero() {
  return (
    <div className="bg-blue-300 p-6 md:p-10 rounded-lg flex flex-col md:flex-row items-center justify-between">
      <div className="relative flex gap-4">
        <div className="absolute inset-0 -z-10 opacity-40 flex space-x-2">
          <img
            src="../../assets/tourBooking/hero1.jpg"
            className="w-24 h-32 object-cover rounded-lg"
            alt="Background 1"
          />
          <img
            src="/images/bg2.jpg"
            className="w-24 h-32 object-cover rounded-lg"
            alt="Background 2"
          />
        </div>

        <div className="relative w-24 h-48 md:w-32 md:h-64 bg-white rounded-xl border-4 border-black">
          <img
            src="https://img.freepik.com/free-photo/laughing-woman-with-dish-menu_23-2147681115.jpg?ga=GA1.1.1305975420.1709091022&semt=ais_hybrid"
            className="w-full h-full object-cover rounded-lg"
            alt="Travel 1"
          />
        </div>
        <div className="relative w-24 h-48 md:w-32 md:h-64 bg-white rounded-xl border-4 border-black scale-110">
          <img
            src="https://img.freepik.com/free-photo/romantic-portrait-young-caucasian-woman-summer-dress-enjoying-relaxing-park-mountain-with-amazing-tropical-sea-view-female-vacation-travel-around-thailand-happy-woman-sunset_343596-1502.jpg?ga=GA1.1.1305975420.1709091022&semt=ais_hybrid"
            className="w-full h-full object-cover rounded-lg"
            alt="Travel 2"
          />
        </div>
        <div className="relative w-24 h-48 md:w-32 md:h-64 bg-white rounded-xl border-4 border-black">
          <img
            src="https://img.freepik.com/free-photo/tourist-reading-book_1368-7034.jpg?ga=GA1.1.1305975420.1709091022&semt=ais_hybrid"
            className="w-full h-full object-cover rounded-lg"
            alt="Travel 3"
          />
        </div>
      </div>

      <div className="text-center md:text-left max-w-lg mt-6 md:mt-0">
        <span className="text-xs font-semibold uppercase text-black bg-white px-2 py-1 rounded-md">
          Powered by TRAVALIA AI
        </span>
        <h1 className="text-4xl font-bold mt-3 text-black leading-tight">
          Plan a trip <br /> that's so <span className="text-black">you</span>
        </h1>
        <p className="text-lg mt-3 text-black">
          From farm tours to forest bathing—get custom recs for whatever you're
          into.
        </p>
        <Link to="/create-package">
          <button className="mt-5 bg-black text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gray-800 transition">
            <span>✦ Start a trip with AI</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
