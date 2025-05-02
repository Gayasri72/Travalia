import React from "react";
import reviews from "../../../../Backend/dev-data/data/reviews";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { HiStar, HiOutlineStar } from "react-icons/hi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ReviewCard = ({ review }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<HiStar key={i} className="w-5 h-5 text-yellow-400" />);
      } else {
        stars.push(<HiOutlineStar key={i} className="w-5 h-5 text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={review.image}
            alt={review.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {review.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(review.rating)}
            </div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 flex-grow">
          {review.review}
        </p>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {review.date || "Recent Travel"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Reviews() {
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real stories from real people. Read reviews from our happy customers who have experienced
            unforgettable journeys with us.
          </p>
        </motion.div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          className="w-full"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
