import { Navbar, TextInput } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return(
    <Navbar className='border-b-2'>
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>TRAVALIA</Link>
      <form>
        <TextInput/>
      </form>
    </Navbar>
  );
}
