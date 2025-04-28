import React from 'react';
import {
  FaWhatsappSquare,
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full bg-slate-500 py-6 px-10 text-gray-300 mt-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-[#41A4FF]">TRAVALIA</h3>
          <p className="py-2 text-white font-light text-sm">
            Discover amazing places and experiences tailored just for you.
          </p>
          <div className="flex gap-6 mt-4">
            <FaWhatsappSquare size={24} />
            <FaFacebookSquare size={24} />
            <FaInstagramSquare size={24} />
            <FaTwitterSquare size={24} />
          </div>
        </div>
        <div className="flex md:justify-around">
          <div>
            <h6 className="font-bold text-[#41a3ff]">Services</h6>
            <ul className="mt-2 font-light">
              <li>
                <Link to='/tours' className="text-sm text-white">Tours</Link>
              </li>
              <li>
                <Link to='/hires' className="text-sm text-white">Hires</Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-[#41A4FF]">Support</h6>
            <ul className="mt-2 font-light">
              <li className="text-sm text-white">
                <Link to="/Contact">Contact us</Link>
              </li>
              <li className="text-sm text-white">
                <Link to="/info">About us</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
