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
    <footer className="w-full bg-slate-900 text-gray-300 pt-10 pb-4 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
        {/* Brand and Social */}
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="text-3xl font-extrabold text-[#41A4FF] tracking-wide">
            TRAVALIA
          </h3>
          <p className="text-white font-light text-sm max-w-xs">
            Discover amazing places and experiences tailored just for you.
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#25D366] transition-colors"
            >
              <FaWhatsappSquare size={28} />
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1877F3] transition-colors"
            >
              <FaFacebookSquare size={28} />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E4405F] transition-colors"
            >
              <FaInstagramSquare size={28} />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1DA1F2] transition-colors"
            >
              <FaTwitterSquare size={28} />
            </a>
          </div>
        </div>
        {/* Links */}
        <div className="flex-1 flex flex-col sm:flex-row justify-end gap-8">
          <div>
            <h6 className="font-bold text-[#41A4FF] mb-2">Services</h6>
            <ul className="space-y-1 font-light">
              <li>
                <Link
                  to="/tours"
                  className="text-sm text-white hover:text-[#41A4FF] transition-colors"
                >
                  Tours
                </Link>
              </li>
              <li>
                <Link
                  to="/hires"
                  className="text-sm text-white hover:text-[#41A4FF] transition-colors"
                >
                  Hires
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold text-[#41A4FF] mb-2">Support</h6>
            <ul className="space-y-1 font-light">
              <li>
                <Link
                  to="/Contact"
                  className="text-sm text-white hover:text-[#41A4FF] transition-colors"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  to="/info"
                  className="text-sm text-white hover:text-[#41A4FF] transition-colors"
                >
                  About us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="border-t border-slate-700 mt-8 pt-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Travalia. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
