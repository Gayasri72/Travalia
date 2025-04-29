import React from 'react';

// Example images from your assets (add or adjust as needed)
const images = [
  'src/assets/tours/tour-1-1.jpg',
  'src/assets/tours/tour-2-1.jpg',
  'src/assets/tours/tour-3-1.jpg',
  'src/assets/tours/tour-4-1.jpg',
  'src/assets/ai/colombo.jpg',
  'src/assets/ai/ella.jpg',
  'src/assets/ai/galle.jpg',
  'src/assets/ai/kandy.jpg',
  'src/assets/ai/polonnaruwa.jpg',
  'src/assets/ai/weligama.jpg',
];

export default function Gallery() {
  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-4 text-blue-700 drop-shadow">
        Gallery of Sri Lanka
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Discover the breathtaking beauty of Sri Lanka through our curated
        gallery. From lush green hills to golden beaches and vibrant cities,
        explore the wonders that await you.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform bg-white"
          >
            <img
              src={img}
              alt={`Sri Lanka view ${idx + 1}`}
              className="w-full h-56 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
