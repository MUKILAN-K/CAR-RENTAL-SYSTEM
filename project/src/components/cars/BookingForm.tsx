import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/api';
import { type Car } from '../../types/mysql';
import { useNavigate } from 'react-router-dom';

interface BookingFormProps {
  car: Car;
}

type FormValues = {
  pickupDate: string;
  returnDate: string;
};

const BookingForm: React.FC<BookingFormProps> = ({ car }) => {
  const [totalPrice, setTotalPrice] = useState(car.price_per_day);
  const [totalDays, setTotalDays] = useState(1);
  const [isAvailable, setIsAvailable] = useState(true);
  
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const minDate = format(new Date(), 'yyyy-MM-dd');
  const maxDate = format(addDays(new Date(), 365), 'yyyy-MM-dd');
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isSubmitting } 
  } = useForm<FormValues>({
    defaultValues: {
      pickupDate: format(new Date(), 'yyyy-MM-dd'),
      returnDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    }
  });
  
  const pickupDate = watch('pickupDate');
  const returnDate = watch('returnDate');
  
  useEffect(() => {
    if (pickupDate && returnDate) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      
      // Calculate total days
      const days = differenceInDays(end, start) + 1;
      setTotalDays(days > 0 ? days : 1);
      
      // Calculate total price
      const price = days > 0 ? days * car.price_per_day : car.price_per_day;
      setTotalPrice(price);
      
      // Check availability
      const checkCarAvailability = async () => {
        try {
          const response = await api.get(`/bookings/car/${car.id}`);
          const bookings = response.data;
          
          const hasOverlap = bookings?.some((booking: any) => 
            booking.status === 'confirmed' &&
            new Date(booking.end_date) >= start &&
            new Date(booking.start_date) <= end
          );
          
          setIsAvailable(!hasOverlap);
        } catch (error) {
          console.error('Error checking availability:', error);
          setIsAvailable(false);
        }
      };
      
      checkCarAvailability();
    }
  }, [pickupDate, returnDate, car.price_per_day, car.id]);
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error('Please login to book a car');
      navigate('/login', { state: { from: `/cars/${car.id}` } });
      return;
    }

    if (!car.price_per_day || totalPrice <= 0) {
      toast.error('Invalid price calculation. Please try again.');
      return;
    }
    
    try {
      const bookingData = {
        car_id: car.id,
        user_id: user.id,
        start_date: data.pickupDate,
        end_date: data.returnDate,
        total_price: totalPrice,
        status: 'confirmed'
      };

      const response = await api.post('/bookings', bookingData);
      
      if (response.status === 200) {
        toast.success('Booking confirmed!');
        navigate('/dashboard/bookings');
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.error || 'Failed to create booking');
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Book This Car</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="pickupDate"
          type="date"
          label="Pickup Date"
          min={minDate}
          max={returnDate}
          icon={<Calendar className="h-5 w-5 text-gray-400" />}
          {...register('pickupDate', { required: 'Pickup date is required' })}
          error={errors.pickupDate?.message}
        />
        
        <Input
          id="returnDate"
          type="date"
          label="Return Date"
          min={pickupDate}
          max={maxDate}
          icon={<Calendar className="h-5 w-5 text-gray-400" />}
          {...register('returnDate', { required: 'Return date is required' })}
          error={errors.returnDate?.message}
        />
        
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Daily Rate:</span>
            <span className="font-medium">${car.price_per_day} / day</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">Duration:</span>
            <span className="font-medium">{totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2 flex justify-between">
            <span className="text-gray-800 dark:text-gray-200 font-medium">Total:</span>
            <span className="text-xl font-bold text-blue-900 dark:text-blue-400">
              ${totalPrice}
            </span>
          </div>
        </div>
        
        {!isAvailable && (
          <div className="p-3 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 rounded-lg text-sm">
            This car is not available during the selected dates. Please choose different dates.
          </div>
        )}
        
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isSubmitting}
          disabled={!isAvailable}
          icon={<DollarSign className="h-4 w-4" />}
        >
          Book Now
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;