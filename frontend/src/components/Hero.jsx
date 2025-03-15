import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import your images
import image1 from '../assets/images1.jpg';
import image2 from '../assets/images1.jpg';
import image3 from '../assets/images1.jpg';

const images = [image1, image2, image3];

export default function Hero() {
  return (
    <div className="relative w-full max-h-[600px]">
      {/* Swiper Slider */}
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 30000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              <img src={img} className="w-full max-h-[600px] object-cover" />

              {/* Animated Text Overlay */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={index} // Ensures animation re-triggers on slide change
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: -40 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-black text-center"
                >
                  <h1 className="text-4xl font-bold">
                    Explore the World with Travalia
                  </h1>
                  <p className="text-lg mt-2">
                    Discover amazing destinations with customized tour packages.
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
