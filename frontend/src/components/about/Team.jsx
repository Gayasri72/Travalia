import React from 'react';
import my from '../../assets/my.jpg';

export default function Team() {
  return (
    <div id="team-section">
      <h2 className="text-3xl font-bold text-center">Meet Our Team</h2>
      <div className="flex flex-wrap gap-10 mt-5">
        <div className="w-[300px] m-4">
          <img src={my} />
          <h3 className="text-xl font-semibold text-center">Gayasri Pethum</h3>
          <p className="text-gray-500 text-center">CEO</p>
        </div>
        <div className="w-[300px] m-4">
          <img src={my} />
          <h3 className="text-xl font-semibold text-center">
            Janindu Dulanjith
          </h3>
          <p className="text-gray-500 text-center">CEO</p>
        </div>
        <div className="w-[300px] m-4">
          <img src={my} />
          <h3 className="text-xl font-semibold text-center">
            Kavindu Theekshana
          </h3>
          <p className="text-gray-500 text-center">CEO</p>
        </div>
        <div className="w-[300px] m-4">
          <img src={my} />
          <h3 className="text-xl font-semibold text-center">
            Malitha Parikalpa
          </h3>
          <p className="text-gray-500 text-center">CEO</p>
        </div>
      </div>
    </div>
  );
}
