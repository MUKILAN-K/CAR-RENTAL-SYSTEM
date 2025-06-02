import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Fuel, Users, Gauge, Thermometer, Calendar, Star } from 'lucide-react';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import CarImageSlider from '../components/cars/CarImageSlider';
import BookingForm from '../components/cars/BookingForm';
import { type Car } from '../types/mysql';

const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCarDetails = async () => {
      setIsLoading(true);
      
      try {
        if (!id) {
          navigate('/cars');
          return;
        }
        
        const response = await api.get(`/cars/${id}`);
        const carData = response.data;
        
        if (!carData) {
          toast.error('Car not found');
          navigate('/cars');
          return;
        }
        
        setCar(carData);
      } catch (error) {
        toast.error('Failed to load car details');
        navigate('/cars');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCarDetails();
  }, [id, navigate]);
  
  if (isLoading || !car) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Cars
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CarImageSlider 
                images={car.images?.length > 0 ? car.images : [car.image_url]} 
                alt={car.name} 
              />
              
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{car.name}</h1>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${
                            i < Math.round(Number(car.rating) || 0) 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      ({(Number(car.rating) || 0).toFixed(1)})
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col items-center">
                    <Fuel className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Fuel Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{car.fuel_type}</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col items-center">
                    <Gauge className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Transmission</span>
                    <span className="font-medium text-gray-900 dark:text-white">{car.transmission}</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col items-center">
                    <Users className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Seats</span>
                    <span className="font-medium text-gray-900 dark:text-white">{car.seats} People</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col items-center">
                    <Thermometer className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">AC</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {car.has_ac ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    About this car
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {car.description}
                  </p>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                      Additional Information
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span>This car model is from {car.model}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-blue-600" />
                        <span>Mileage: {car.mileage} miles</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <BookingForm car={car} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;