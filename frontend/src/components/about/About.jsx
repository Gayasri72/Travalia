import React from 'react';

export default function About() {
  return (
    <div
      id="about-section"
      className=" bg-gray-100 m-4 p-14 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        About{' '}
        <span className="underline underline-offset-4 decoration-1 under font-light">
          Us
        </span>{' '}
      </h2>
      <p>
        TRAVALIA, the world's largest travel guidance platform*, helps millions
        of people each month become better travelers, from planning to booking
        to taking a trip. Travelers across the globe use TRAVALIA’s website and
        app to discover where to stay, what to do and where to eat based on
        guidance from those who have been there before. With more than a billion
        reviews and contributions, travelers turn to Tripadvisor to find deals
        on accommodations, book experiences, reserve tables at delicious
        restaurants and discover great places nearby. TRAVALIA LLC is a wholly
        owned subsidiary of Tripadvisor, Inc. (Nasdaq: TRIP). The subsidiaries
        of TRAVALIA, Inc. own and operate a portfolio of travel media brands and
        businesses, operating under various websites and apps.
      </p>
    </div>
  );
}
