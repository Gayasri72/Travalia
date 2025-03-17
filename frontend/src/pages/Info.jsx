import React from 'react';
import AboutHero from '../components/about/AboutHero';
import Team from '../components/about/Team';
import About from '../components/about/About';
import Privacy from '../components/about/Privacy';

export default function Info() {
  return (
    <div>
      <AboutHero />
      <About />

      <Team />
      <Privacy />
    </div>
  );
}
