
import { Button, Label, Navbar, TextInput } from 'flowbite-react';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon } from 'react-icons/fa';
import ICON from '../assets/icon.png';
export default function Header() {
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="flex items-center gap-2 self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <img src={ICON} className="w-14 h-12 rounded-full  " alt="icon" />
        <span className="text-3xl  font-bold tracking-wide text-black dark:text-white">
          TRAVALIA
        </span>
      </Link>

      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hiddden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to="/sign-in">
          <Button gradientDuoTone="purpleToBlue">Get Started</Button>
        </Link>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/tours'} as={'div'}>
          <Link to="/tours">Tours</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/hires'} as={'div'}>
          <Link to="/hires">Hires</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/galley'} as={'div'}>
          <Link to="/gallery">Gallery</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
