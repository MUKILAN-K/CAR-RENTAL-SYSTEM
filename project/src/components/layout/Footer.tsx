import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <Car className="h-8 w-8" />
              <span>CarzNow</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Providing premium car rental services with a wide range of vehicles to suit all your needs.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center hover:bg-blue-500 transition"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-pink-600 flex items-center justify-center hover:bg-pink-700 transition"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cars" className="text-gray-400 hover:text-white transition">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition">
                  Login / Register
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Car Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Car Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cars?type=SUV" className="text-gray-400 hover:text-white transition">
                  SUVs
                </Link>
              </li>
              <li>
                <Link to="/cars?type=Sedan" className="text-gray-400 hover:text-white transition">
                  Sedans
                </Link>
              </li>
              <li>
                <Link to="/cars?type=Luxury" className="text-gray-400 hover:text-white transition">
                  Luxury Cars
                </Link>
              </li>
              <li>
                <Link to="/cars?type=Convertible" className="text-gray-400 hover:text-white transition">
                  Convertibles
                </Link>
              </li>
              <li>
                <Link to="/cars?type=Hatchback" className="text-gray-400 hover:text-white transition">
                  Hatchbacks
                </Link>
              </li>
              <li>
                <Link to="/cars?transmission=Automatic" className="text-gray-400 hover:text-white transition">
                  Automatic Cars
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                <span className="text-gray-400">
                  123 Rental Street, Carville, CA 90210, USA
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a href="tel:+11234567890" className="text-gray-400 hover:text-white transition">
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <a href="mailto:info@carznow.com" className="text-gray-400 hover:text-white transition">
                  info@carznow.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {currentYear} CarzNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;