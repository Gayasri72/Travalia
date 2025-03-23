import React from "react";
import reviews from "../../../../Backend/dev-data/data/reviews";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Reviews() {
  return (
    <div className="container mx-auto py-10 lg:px-32 w-full overflow-hidden" id="team-section">
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        Why{" "}
        <span className="underline underline-offset-4 decoration-1 font-light">
          Us
        </span>
      </h1>
      <p className="text-center text-gray-500 mb-12 max-w-80 mx-auto">
        Real stories from real people. Read reviews from our happy customers.
      </p>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
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
          <SwiperSlide key={index} className="flex justify-center">
            <div className="max-w-[340px] border shadow-lg rounded px-8 py-12 text-center">
              <img
                src={review.image}
                alt={review.name}
                className="w-20 h-20 rounded-full mb-4 mx-auto"
              />
              <h2 className="text-xl font-semibold">{review.name}</h2>
              <p className="text-gray-500">{review.review}</p>
              <p className="text-gray-500 mt-4">{review.rating}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
