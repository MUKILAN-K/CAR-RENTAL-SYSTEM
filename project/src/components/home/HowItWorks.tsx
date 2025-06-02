import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Car, CheckCircle } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Find Your Car',
    description: 'Browse our wide selection of vehicles and find the perfect car for your needs.',
    icon: <Search className="h-8 w-8" />,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Book & Pay',
    description: 'Select your dates, complete the booking form, and make a secure payment.',
    icon: <Calendar className="h-8 w-8" />,
    color: 'bg-green-500',
  },
  {
    id: 3,
    title: 'Pick Up Car',
    description: 'Arrive at our location, show your booking confirmation, and drive away in your rental car.',
    icon: <Car className="h-8 w-8" />,
    color: 'bg-amber-500',
  },
  {
    id: 4,
    title: 'Return & Review',
    description: 'Return the car at the agreed time and location, then share your experience with us.',
    icon: <CheckCircle className="h-8 w-8" />,
    color: 'bg-purple-500',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-blue-50 dark:bg-blue-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <motion.div 
            className="w-20 h-1 bg-blue-600 mx-auto mb-4"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          ></motion.div>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Renting a car with CarzNow is quick and easy. Just follow these simple steps.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-300 dark:bg-gray-700 -z-10"></div>
              )}
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center relative z-10">
                <div className={`${step.color} text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {step.icon}
                  <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-blue-900 dark:bg-blue-700 text-white flex items-center justify-center font-bold">
                    {step.id}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;