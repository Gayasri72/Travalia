import React, { useState } from 'react';

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
  const [dreamTrip, setDreamTrip] = useState([]);
  const [draggedImg, setDraggedImg] = useState(null);

  const handleDragStart = (img) => setDraggedImg(img);
  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedImg && !dreamTrip.includes(draggedImg)) {
      setDreamTrip([...dreamTrip, draggedImg]);
    }
    setDraggedImg(null);
  };
  const handleDragOver = (e) => e.preventDefault();
  const removeFromDreamTrip = (img) => setDreamTrip(dreamTrip.filter(i => i !== img));

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center mb-10">
        <img
          src="src/assets/Home/images1.jpg"
          alt="Sri Lanka Banner"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-75"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2">
            Gallery of Sri Lanka
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto drop-shadow">
            Discover the breathtaking beauty of Sri Lanka through our curated
            gallery.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-2xl shadow-lg bg-white relative hover:shadow-2xl transition-all duration-300 cursor-grab"
              draggable
              onDragStart={() => handleDragStart(img)}
            >
              <img
                src={img}
                alt={`Sri Lanka view ${idx + 1}`}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end p-4">
                <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Sri Lanka view {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Dream Trip Drop Area */}
      <div
        className="w-full bg-blue-100 border-t-4 border-blue-400 min-h-[120px] flex flex-col items-center justify-center py-6 transition-all"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-2">My Dream Trip</h2>
        {dreamTrip.length === 0 ? (
          <p className="text-blue-500">Drag your favorite images here to build your dream itinerary!</p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
            {dreamTrip.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt="Dream Trip"
                  className="w-24 h-24 object-cover rounded-xl border-2 border-blue-400 shadow"
                />
                <button
                  onClick={() => removeFromDreamTrip(img)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
