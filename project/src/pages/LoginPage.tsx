import React from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import AuthForm from '../components/auth/AuthForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="hidden md:block relative">
            <div 
              className="absolute inset-0 bg-blue-900 bg-opacity-80"
              style={{ 
                backgroundImage: `url('https://images.pexels.com/photos/2834653/pexels-photo-2834653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                mixBlendMode: 'multiply'
              }}
            ></div>
            <div className="relative h-full flex flex-col items-center justify-center p-8 text-white z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Car className="h-16 w-16 mb-4" />
                <h2 className="text-2xl font-bold mb-6">Welcome to CarzNow</h2>
                <p className="text-gray-200 mb-8">
                  Your journey starts here. Sign in to access your account and manage your car rentals.
                </p>
                <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                  <h3 className="font-medium mb-2">Why choose CarzNow?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                      <span>Wide selection of premium vehicles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                      <span>Easy booking and management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                      <span>Competitive prices and special offers</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AuthForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;