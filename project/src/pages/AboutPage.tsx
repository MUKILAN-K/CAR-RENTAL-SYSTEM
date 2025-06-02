import React from 'react';
import { motion } from 'framer-motion';
import { Car, Shield, Clock, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              About CarzNow
            </h1>
            
            <div className="prose prose-lg dark:prose-invert mb-12">
              <p className="text-gray-600 dark:text-gray-400">
                CarzNow is your premier destination for hassle-free car rentals. We believe in making 
                the car rental experience as smooth and enjoyable as possible, offering a wide selection 
                of vehicles to suit every need and budget.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <Car className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Premium Fleet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our fleet includes everything from economical daily drivers to luxury vehicles, 
                  all maintained to the highest standards.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <Shield className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Safe & Secure
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All our vehicles are regularly inspected and come with comprehensive insurance 
                  coverage for your peace of mind.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <Clock className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  24/7 Support
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our customer support team is available around the clock to assist you with any 
                  queries or concerns.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <Award className="h-8 w-8 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Best Rates
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer competitive pricing and regular promotions to ensure you get the best 
                  value for your money.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-900 dark:bg-blue-800 text-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-blue-100 mb-6">
                To provide accessible, reliable, and high-quality car rental services that exceed 
                our customers' expectations while maintaining the highest standards of safety and 
                customer service.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-300">1000+</div>
                  <div className="text-sm text-blue-200">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-300">20+</div>
                  <div className="text-sm text-blue-200">Car Models</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-300">24/7</div>
                  <div className="text-sm text-blue-200">Customer Support</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;