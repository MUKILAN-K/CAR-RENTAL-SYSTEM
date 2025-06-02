import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCarsStore } from '../../store/useCarsStore';
import CarCard from '../cars/CarCard';

const FeaturedCars: React.FC = () => {
  const { cars, fetchCars, isLoading } = useCarsStore();
  
  useEffect(() => {
    fetchCars();
  }, [fetchCars]);
  
  // Get only the first 4 cars for featured section
  const featuredCars = cars.slice(0, 4);
  
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Cars</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Explore our top-rated vehicles for your next adventure
            </p>
          </div>
          
          <Link 
            to="/cars" 
            className="flex items-center text-blue-600 hover:text-blue-500 font-medium dark:text-blue-400 dark:hover:text-blue-300"
          >
            View All
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;