import React from 'react'

function Policy() {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        <div>
            <img src="/src/assets/Home/p1.png" className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Easy Exchange Policy</p>
            <p className='text-gray-400'>we offer hassle free exchange policy</p>
        </div>
        <div>
            <img src="/src/assets/Home/p2.png" className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Easy Exchange Policy</p>
            <p className='text-gray-400'>we offer hassle free exchange policy</p>
        </div>
        <div>
            <img src="/src/assets/Home/p3.png" className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Easy Exchange Policy</p>
            <p className='text-gray-400'>we offer hassle free exchange policy</p>
        </div>
    </div>
  )
}

export default Policy