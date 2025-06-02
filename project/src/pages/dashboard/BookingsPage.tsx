import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isPast } from 'date-fns';
import { Clock, X, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useBookingStore } from '../../store/useBookingStore';
import { useCarsStore } from '../../store/useCarsStore';
import { Button } from '../../components/ui/Button';
import { type Car } from '../../types/mysql';

const BookingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { bookings, fetchUserBookings, cancelBooking, isLoading } = useBookingStore();
  const { getCar } = useCarsStore();
  const [carDetails, setCarDetails] = useState<Record<string, Car>>({});
  
  useEffect(() => {
    if (user) {
      fetchUserBookings(user.id);
    }
  }, [user, fetchUserBookings]);
  
  useEffect(() => {
    const loadCarDetails = async () => {
      const details: Record<string, Car> = {};
      
      for (const booking of bookings) {
        if (!details[booking.car_id]) {
          const car = await getCar(booking.car_id);
          if (car) {
            details[booking.car_id] = car;
          }
        }
      }
      
      setCarDetails(details);
    };
    
    if (bookings.length > 0) {
      loadCarDetails();
    }
  }, [bookings, getCar]);
  
  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await cancelBooking(bookingId);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No Bookings Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You haven't made any car bookings yet.
        </p>
        <Link to="/cars">
          <Button>Browse Cars</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Bookings
      </h2>
      
      <div className="space-y-4">
        {bookings.map((booking) => {
          const car = carDetails[booking.car_id];
          const startDate = new Date(booking.start_date);
          const endDate = new Date(booking.end_date);
          const isPastBooking = isPast(endDate);
          
          return (
            <div 
              key={booking.id}
              className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex flex-col md:flex-row gap-4"
            >
              {car && (
                <div className="w-full md:w-1/4">
                  <img 
                    src={car.image_url} 
                    alt={car.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {car?.name || 'Car Details Loading...'}
                  </h3>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(startDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Return Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(endDate, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <p className="font-bold text-gray-900 dark:text-white">
                    Total: ${booking.total_price}
                  </p>
                  
                  <div className="flex gap-3">
                    {booking.status === 'confirmed' && !isPastBooking && (
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel
                      </Button>
                    )}
                    
                    <Link to={`/dashboard/bookings/${booking.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        icon={<ChevronRight className="h-4 w-4" />}
                      >
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingsPage;