import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedCars from '../components/home/FeaturedCars';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedCars />
      <HowItWorks />
      <Testimonials />
    </div>
  );
};

export default HomePage;