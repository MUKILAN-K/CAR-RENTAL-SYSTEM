import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Users, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';
import api from '../../lib/api';
import { Card, CardContent } from '../../components/ui/Card';

interface AdminStats {
  totalCars: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: any[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalCars: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        // Get total counts using Promise.all for parallel requests
        const responses = await Promise.all([
          api.get('/cars/total'),
          api.get('/profiles/total'),
          api.get('/bookings/total'),
          api.get('/bookings/revenue'),
          api.get('/bookings/recent')
        ]);

        // Extract data from responses
        const [
          { data: { count: totalCars } },
          { data: { count: totalUsers } },
          { data: { count: totalBookings } },
          { data: { total: totalRevenue } },
          { data: recentBookings }
        ] = responses;

        setStats({
          totalCars: totalCars || 0,
          totalUsers: totalUsers || 0,
          totalBookings: totalBookings || 0,
          totalRevenue: totalRevenue || 0,
          recentBookings: recentBookings || [],
        });
      } catch (error) {
        console.error('Error loading admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Cars */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Cars</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCars}</h3>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                <Car className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <Link to="/admin/cars" className="text-blue-600 dark:text-blue-400 hover:underline">
                Manage Cars
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</h3>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <Link to="/admin/users" className="text-blue-600 dark:text-blue-400 hover:underline">
                Manage Users
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Bookings</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</h3>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 text-sm">
              <Link to="/admin/bookings" className="text-blue-600 dark:text-blue-400 hover:underline">
                View Bookings
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats.totalRevenue.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 text-sm flex items-center text-green-600 dark:text-green-400">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>32% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
          <Link to="/admin/bookings" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-3">Car</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Booked On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((booking) => (
                  <tr key={booking.id} className="text-sm">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={booking.car_image}
                          alt={booking.car_name}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {booking.car_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {booking.user_name}<br />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {booking.user_email}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {new Date(booking.start_date).toLocaleDateString()} -{' '}
                      {new Date(booking.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      ${booking.total_price}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium 
                        ${booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(booking.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No recent bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;