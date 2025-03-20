
import React from 'react'
import Hero from '../components/home/Hero'
import Latest from '../components/home/Latest'
import Policy from '../components/home/Policy'
import NewsLetterBox from '../components/NewsLetterBox'
import Ads1 from '../components/home/ads1'
import Reviews from '../components/home/reviews'


export default function Home() {
  return (
    <div><Hero/>
    <Latest/>
    <Policy/>
    <Ads1/>
    <Reviews/>
    <NewsLetterBox/>
    </div>
  )


}
