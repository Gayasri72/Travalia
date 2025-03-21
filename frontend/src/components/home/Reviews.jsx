import React from 'react';
import reviews from '../../../../Backend/dev-data/data/reviews';


export default function Reviews() {
  return (
    <div
      className="container mx-auto py-10 lg:px-32 w-full overflow-hidden"
      id="team-section"
    >
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        Why {' '}
        <span className="underline underline-offset-4 decoration-1 under font-light">
          Us
        </span>
      </h1>
      <p className="text-center text-gray-500 mb-12 max-w-80 mx-auto">
        Real Heros behind the scene
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {reviews.map((reviews, index) => (
          <div
            key={index}
            className="max-w-[340px] border shadow-lg rounded px-8 py-12 text-center"
          >
            <img
              src={reviews.image}
              alt={reviews.name}
              className="w-20 h-20 rounded-full mb-4 mx-auto"
            />
            <h2 className="text-xl font-semibold text-center">
              {reviews.name}
            </h2>
            <p className="text-gray-500 text-center">{reviews.review}</p>
            <p className="text-gray-500 text-center mt-4">{reviews.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
