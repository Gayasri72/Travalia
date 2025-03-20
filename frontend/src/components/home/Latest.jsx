import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';

const fetchTopTours = async () => {
  const response = await fetch('http://localhost:3000/api/tours/top-5-cheap');
  const data = await response.json();
  if (!data.success) throw new Error('Failed to fetch tours');

  return data.data.tours;
};

const Latest = () => {
  const {
    data: tours = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['topTours'],
    queryFn: fetchTopTours,
  });

  if (isLoading) return <span>Loading tours...</span>;
  if (error) return <span>Error: {error.message}</span>;

  return (
    <div className="container mx-auto py-10 px-4 lg:px-32 w-full">
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        Latest{' '}
        <span className="underline underline-offset-4 decoration-1 under font-light">
          Tours
        </span>
      </h1>
      <p className="text-center text-gray-500 mb-12 max-w-80 mx-auto">
        Real Heros behind the scene
      </p>

      {/* Swiper 3D Coverflow Slider */}
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        spaceBetween={-20} // Slightly increased space
        slidesPerView={1} // Default to 1 slide for small screens
        breakpoints={{
          640: { slidesPerView: 1 }, // Small screens - 1 slide
          768: { slidesPerView: 2 }, // Medium screens - 2 slides
          1024: { slidesPerView: 3 }, // Large screens - 3 slides
        }}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 180, // Increased depth for more 3D effect
          modifier: 1.5,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        navigation
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="w-full max-w-5xl mx-auto"
      >
        {tours.map((tour) => (
          <SwiperSlide key={tour._id} className="w-72">
            {' '}
            {/* Increased slide width */}
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Tour Image */}
              <Link to={`/tours/${tour._id}`}>
                <img
                   src={`src/assets/tours/${tour.imageCover}`}
                  alt={tour.name || 'Tour Image'}
                  className="w-full h-72 object-cover rounded-t-lg"
                />
              </Link>

              {/* Overlay with Name */}
              <div className="absolute bottom-0 bg-gradient-to-t from-black via-transparent to-transparent w-full p-3">
                <h2 className="text-white text-lg font-semibold text-center">
                  {tour.name}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Latest;
