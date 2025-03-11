import { Button, Navbar, TextInput } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { FaMoon } from 'react-icons/fa';

export default function Header() {
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        TRAVALIA
      </Link>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hiddden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to="/sign-in">
          <Button gradientDuoTone="purpleToBlue">Get Started</Button>
        </Link>
      </div>
      <Navbar.Collapse>
        <Navbar.Link>
          <Link to="/tours">Tours</Link>
        </Navbar.Link>
        <Navbar.Link>
          <Link to="/hires">Hires</Link>
        </Navbar.Link>
        <Navbar.Link>
          <Link to="/gallery">Gallery</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
