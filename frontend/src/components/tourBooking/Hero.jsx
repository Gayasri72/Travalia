import React from 'react';
import { Link } from 'react-router-dom';
import hero1 from '../../assets/tourBooking/hero1.jpg';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-200 via-blue-100 to-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center justify-between px-4 py-10 md:py-16 gap-8 md:gap-12">
      {/* Decorative background shapes */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300 opacity-30 rounded-full blur-2xl z-0" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 opacity-20 rounded-full blur-2xl z-0" />

      {/* Images collage */}
      <div className="relative flex gap-4 z-10">
        <div className="hidden md:block absolute -left-16 top-10 rotate-[-8deg] opacity-60">
          <img
            src={hero1}
            className="w-24 h-32 object-cover rounded-xl shadow-lg border-2 border-white"
            alt="Background 1"
          />
        </div>
        <div className="relative w-20 h-40 md:w-28 md:h-56 bg-white rounded-xl border-4 border-blue-200 shadow-lg overflow-hidden">
          <img
            src="https://img.freepik.com/free-photo/laughing-woman-with-dish-menu_23-2147681115.jpg?ga=GA1.1.1305975420.1709091022&semt=ais_hybrid"
            className="w-full h-full object-cover rounded-xl"
            alt="Travel 1"
          />
        </div>
        <div className="relative w-24 h-48 md:w-32 md:h-64 bg-white rounded-xl border-4 border-blue-300 shadow-lg scale-110 overflow-hidden">
          <img
            src="https://img.freepik.com/free-photo/romantic-portrait-young-caucasian-woman-summer-dress-enjoying-relaxing-park-mountain-with-amazing-tropical-sea-view-female-vacation-travel-around-thailand-happy-woman-sunset_343596-1502.jpg?ga=GA1.1.1305975420.1709091022&semt=ais_hybrid"
            className="w-full h-full object-cover rounded-xl"
            alt="Travel 2"
          />
        </div>
        <div className="relative w-20 h-40 md:w-28 md:h-56 bg-white rounded-xl border-4 border-blue-200 shadow-lg overflow-hidden">
          <img
            src="https://img.freepik.com/free-photo/tourist-reading-book_1368-7034.jpg?ga=GA1.1.1305975420.1709091022&semt=ais_hybrid"
            className="w-full h-full object-cover rounded-xl"
            alt="Travel 3"
          />
        </div>
      </div>

      {/* Hero text content */}
      <div className="z-10 text-center md:text-left max-w-lg mt-6 md:mt-0">
        <span className="text-xs font-semibold uppercase text-blue-700 bg-white/80 px-3 py-1 rounded-full shadow inline-block mb-2 tracking-wider">
          Powered by <span className="font-bold">TRAVALIA AI</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-blue-900 leading-tight drop-shadow-sm">
          Plan a trip <br /> that's so{' '}
          <span className="text-blue-500">you</span>
        </h1>
        <p className="text-lg md:text-xl mt-4 text-blue-800/90 font-medium">
          From farm tours to forest bathing—get custom recommendations for
          whatever you're into.
        </p>
        <Link to="/create-package">
          <button className="mt-7 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all text-base md:text-lg">
            <span>✦ Create Tour Plan with TRAVALIA</span>
          </button>
        </Link>
      </div>
    </section>
  );
}
