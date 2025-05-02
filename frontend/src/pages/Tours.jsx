import React from 'react';
import Hero from '../components/tourBooking/Hero';
import TourSection from '../components/tourBooking/TourSection';
import Ads1 from '../components/home/ads1';

export default function Tours() {
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <Hero />
        <TourSection />
        <Ads1 />
      </div>
    </div>
  );
}
