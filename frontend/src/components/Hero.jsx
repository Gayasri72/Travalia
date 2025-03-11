import React from 'react';
import images1 from '../assets/images1.jpeg';

export default function Hero () {
  return (
    <div>
      <img  src={images1} className='w-full max-h-[600px] object-cover'/>
    </div>
  );
}
