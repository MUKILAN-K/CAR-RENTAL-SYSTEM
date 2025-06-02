import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LayoutDashboard,
  Car,
  Calendar,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { logout } = useAuthStore();
  
  const navLinks = [
    {
      to: '/admin',
      exact: true,
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard',
    },
    {
      to: '/admin/cars',
      icon: <Car className="h-5 w-5" />,
      label: 'Manage Cars',
    },
    {
      to: '/admin/bookings',
      icon: <Calendar className="h-5 w-5" />,
      label: 'Bookings',
    },
    {
      to: '/admin/users',
      icon: <Users className="h-5 w-5" />,
      label: 'Users',
    },
    {
      to: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
    },
  ];
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Logged in as</p>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Administrator</h3>
                </div>
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
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;