import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fuel, Users, Gauge, Car as CarIcon } from 'lucide-react';
import { type Car } from '../../types/mysql';
import { Card, CardContent } from '../ui/Card';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  // Convert rating to number and provide default value
  const rating = Number(car.rating || 0);
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/cars/${car.id}`}>
        <Card className="h-full">
          <div className="relative">
            <img 
              src={car.image_url} 
              alt={car.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white font-medium">View Details</span>
            </div>
          </div>
          
          <CardContent>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {car.name}
              </h3>
              <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded text-sm font-medium">
                <CarIcon className="h-3 w-3" />
                <span>{car.car_type}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-yellow-500 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`h-4 w-4 fill-current ${i < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({rating.toFixed(1)})
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                <Fuel className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{car.fuel_type}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{car.seats} Seats</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                <Gauge className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{car.transmission}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-blue-900 dark:text-blue-400">${car.price_per_day}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400"> / day</span>
              </div>
              <button className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-600">
                Book Now
              </button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default CarCard;