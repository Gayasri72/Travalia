import React from 'react'
import Hero from '../components/tourBooking/Hero'
import TourSection from '../components/tourBooking/TourSection'
import Ads1 from '../components/home/ads1'

export default function Tours() {
  return (
    <div className='space-y-8'><Hero/>
    <TourSection/>
    <Ads1/>
    </div>
  )
}
