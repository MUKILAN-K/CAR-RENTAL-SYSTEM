import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ButtonLink } from '../ui/Button';

const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-950 dark:to-blue-800 min-h-screen">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-black opacity-50"
          style={{ 
            backgroundImage: `url('https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        ></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 pt-40 pb-24 flex flex-col items-center text-center">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Rent Your Perfect Car <br className="hidden md:block" />
          <motion.span
            className="text-yellow-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            With Just A Few Clicks
          </motion.span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-200 max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Experience the freedom of the open road with our premium selection of vehicles.
          From compact cars to luxury SUVs, we have the perfect ride for your journey.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <ButtonLink 
            to="/cars" 
            size="lg" 
            variant="secondary"
            icon={<Search className="h-5 w-5" />}
          >
            Browse Cars
          </ButtonLink>
          
          <ButtonLink 
            to="/about" 
            size="lg" 
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white/10"
          >
            Learn More
          </ButtonLink>
        </motion.div>
        
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-white flex justify-center"
          >
            <motion.div
              animate={{ height: ['30%', '60%', '30%'] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 bg-white rounded-full mt-1"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;