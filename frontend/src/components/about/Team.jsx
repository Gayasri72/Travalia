import React from 'react';
import { testimonialsData } from '../../assets/about/team';

export default function Team() {
  return (
    <div
      className="container mx-auto py-10 lg:px-32 w-full overflow-hidden"
      id="team-section"
    >
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        Our{' '}
        <span className="underline underline-offset-4 decoration-1 under font-light">
          Team
        </span>
      </h1>
      <p className="text-center text-gray-500 mb-12 max-w-80 mx-auto">
        Real Heros behind the scene
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {testimonialsData.map((testimonial, index) => (
          <div
            key={index}
            className="max-w-[340px] border shadow-lg rounded px-8 py-12 text-center"
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-20 h-20 rounded-full mb-4 mx-auto"
            />
            <h2 className="text-xl font-semibold text-center">
              {testimonial.name}
            </h2>
            <p className="text-gray-500 text-center">{testimonial.title}</p>
            <p className="text-gray-500 text-center mt-4">{testimonial.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
