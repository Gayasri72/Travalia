import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import aboutImg from '../../assets/about.jpg';

export default function AboutHero() {
  return (
    <>
      <div className="md:px-36 px-8 md:py-28 py-5">
        <div className="flex lg:flex-row flex-col gap-10">
          <div className="flex flex-col gap-5 justify-center p-5">
            <h1 className="text-4xl md:text-5xl font-bold">Media Center</h1>

            <p className="mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <nav className="bg-gray-100 shadow-md py-4">
              <div className="container mx-auto flex justify-center space-x-6">
                <ScrollLink
                  to="about-section"
                  smooth={true}
                  duration={500}
                  className="cursor-pointer hover:text-blue-600 font-semibold"
                >
                  About Travalia
                </ScrollLink>
                <ScrollLink
                  to="team-section"
                  smooth={true}
                  duration={500}
                  className="cursor-pointer hover:text-blue-600 font-semibold"
                >
                  Our Team
                </ScrollLink>
                <ScrollLink
                  to="services-section"
                  smooth={true}
                  duration={500}
                  className="cursor-pointer hover:text-blue-600 font-semibold"
                >
                  Privacy Policy
                </ScrollLink>
              </div>
            </nav>
          </div>

          <div>
            <img
              src={aboutImg}
              alt="heroimg"
              className="rounded-2xl w-[900px] h-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}
