import React from 'react';

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-gray-200">
      {/* Left Side: Text Content */}
      <div className="max-w-xl text-center md:text-left">
        <p className="flex items-center justify-center md:justify-start gap-2 text-blue-500 font-semibold text-lg">
          Know Before You Go <span>🌍</span>
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-3 leading-tight">
          Traveling opens the door <br />
          to creating <span className="text-blue-500">memories</span>
        </h1>
        <p className="text-gray-600 mt-4 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur, adipiscing elit. Ullam ipsum
          nobis asperiores soluta voluptas quas voluptates. Molestiae tempora
          dignissimos, animi praesentium molestias perferendis porro expedita
          delectus. Soluta natus porro.
        </p>
      </div>

      {/* Right Side: Images */}
      <div className="mt-8 md:mt-0 flex flex-col md:flex-row gap-4">
        {/* Image 1 */}
        <div className="w-32 md:w-40 lg:w-48 h-56 md:h-72 rounded-3xl shadow-lg overflow-hidden ">
          <img
            src="/src/assets/Home/images1.jpg"
            alt="Travel 1"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Video */}
        <div className="w-32 md:w-40 lg:w-48 h-56 md:h-72 rounded-3xl shadow-lg overflow-hidden my-6 ">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src="src/assets/Home/homevid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Image 2 */}
        <div className="w-32 md:w-40 lg:w-48 h-56 md:h-72 rounded-3xl shadow-lg overflow-hidden my-10">
          <img
            src="/src/assets/Home/images2.jpg"
            alt="Travel 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
