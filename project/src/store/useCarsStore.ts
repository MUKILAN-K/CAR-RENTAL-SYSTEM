import { create } from 'zustand';
import { type Car } from '../types/mysql';
import api from '../lib/api';

interface FilterOptions {
  priceRange?: [number, number];
  carType?: string;
  fuelType?: string;
  transmission?: string;
  search?: string;
}

type CarsState = {
  cars: Car[];
  filteredCars: Car[];
  isLoading: boolean;
  error: string | null;
  filterOptions: FilterOptions;
  fetchCars: () => Promise<void>;
  getCar: (id: string) => Promise<Car | null>;
  filterCars: (options: FilterOptions) => void;
  resetFilters: () => void;
};

export const useCarsStore = create<CarsState>((set, get) => ({
  cars: [],
  filteredCars: [],
  isLoading: false,
  error: null,
  filterOptions: {},
  
  fetchCars: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/cars');
      const data = response.data;
      set({ 
        cars: data, 
        filteredCars: data,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  getCar: async (id: string) => {
    const { cars } = get();
    const cachedCar = cars.find(car => car.id === id);
    
    if (cachedCar) return cachedCar;
    
    try {
      const response = await api.get(`/cars/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },
  
  filterCars: (options: FilterOptions) => {
    set({ filterOptions: options });
    
    const { cars } = get();
    let filtered = [...cars];
    
    if (options.priceRange) {
      const [min, max] = options.priceRange;
      filtered = filtered.filter(car => 
        car.price_per_day >= min && car.price_per_day <= max
      );
    }
    
    if (options.carType) {
      filtered = filtered.filter(car => 
        car.car_type.toLowerCase() === options.carType?.toLowerCase()
      );
    }
    
    if (options.fuelType) {
      filtered = filtered.filter(car => 
        car.fuel_type.toLowerCase() === options.fuelType?.toLowerCase()
      );
    }
    
    if (options.transmission) {
      filtered = filtered.filter(car => 
        car.transmission.toLowerCase() === options.transmission?.toLowerCase()
      );
    }
    
    if (options.search && options.search.trim() !== '') {
      const searchTerm = options.search.toLowerCase().trim();
      filtered = filtered.filter(car => 
        car.name.toLowerCase().includes(searchTerm) || 
        car.description.toLowerCase().includes(searchTerm)
      );
    }
    
    set({ filteredCars: filtered });
  },
  
  resetFilters: () => {
    const { cars } = get();
    set({ filterOptions: {}, filteredCars: cars });
  },
}));