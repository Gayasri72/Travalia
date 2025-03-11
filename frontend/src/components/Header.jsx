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
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link>
          <Link to="/contact">Contact Us</Link>
        </Navbar.Link>
        <Navbar.Link>
          <Link to="/info">Galley</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
