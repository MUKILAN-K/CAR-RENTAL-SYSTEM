import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  User,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, profile, logout } = useAuthStore();
  
  const navLinks = [
    {
      to: '/dashboard',
      exact: true,
      icon: <User className="h-5 w-5" />,
      label: 'Profile',
    },
    {
      to: '/dashboard/bookings',
      icon: <Calendar className="h-5 w-5" />,
      label: 'My Bookings',
    },
    {
      to: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
    },
  ];
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold mb-3">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {profile?.full_name || 'User'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {user?.email}
                </p>
              </div>
              
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.exact}
                    className={({ isActive }) => 
                      `flex items-center px-4 py-2.5 rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
                      }`
                    }
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </NavLink>
                ))}
                
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center px-4 py-2.5 rounded-md transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;