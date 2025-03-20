
import React from 'react'
import Hero from '../components/home/Hero'
import Latest from '../components/home/Latest'
import Policy from '../components/home/Policy'
import NewsLetterBox from '../components/NewsLetterBox'


export default function Home() {
  return (
    <div><Hero/>
    <Latest/>
    <Policy/>
    <NewsLetterBox/>
    </div>
  )


}
