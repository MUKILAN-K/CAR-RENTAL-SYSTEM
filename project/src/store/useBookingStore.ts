import { create } from 'zustand';
import { type Booking } from '../types/mysql';
import { differenceInDays } from 'date-fns';
import api from '../lib/api';

type BookingState = {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchUserBookings: (userId: string) => Promise<void>;
  fetchAllBookings: () => Promise<void>;
  createBooking: (carId: string, userId: string, startDate: Date, endDate: Date, pricePerDay: number) => Promise<{ booking: Booking | null; error: any | null }>;
  cancelBooking: (bookingId: string) => Promise<{ error: any | null }>;
  checkAvailability: (carId: string, startDate: Date, endDate: Date) => Promise<boolean>;
};

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,
  
  fetchUserBookings: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      set({ bookings: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchAllBookings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/bookings');
      set({ bookings: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  createBooking: async (carId, userId, startDate, endDate, pricePerDay) => {
    try {
      const days = differenceInDays(endDate, startDate) + 1;
      const totalPrice = days * pricePerDay;
      
      const response = await api.post('/bookings', {
        car_id: carId,
        user_id: userId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_price: totalPrice,
        status: 'confirmed'
      });
      
      await get().fetchUserBookings(userId);
      return { booking: response.data, error: null };
    } catch (error) {
      return { booking: null, error };
    }
  },
  
  cancelBooking: async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status: 'cancelled' });
      
      set(state => ({
        bookings: state.bookings.map(booking =>
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      }));
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
  
  checkAvailability: async (carId, startDate, endDate) => {
    try {
      const response = await api.get(`/bookings/car/${carId}`);
      const bookings = response.data;
      
      // Check if there are any overlapping confirmed bookings
      const hasOverlap = bookings?.some((booking: Booking) => 
        booking.status === 'confirmed' &&
        new Date(booking.end_date) >= startDate &&
        new Date(booking.start_date) <= endDate
      );
      
      return !hasOverlap;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }
}));