import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Input';
import { Button } from '../ui/Button';

interface CarFiltersProps {
  onFilterChange: (filters: any) => void;
}

const CarFilters: React.FC<CarFiltersProps> = ({ onFilterChange }) => {
  const [search, setSearch] = React.useState('');
  const [carType, setCarType] = React.useState('');
  const [fuelType, setFuelType] = React.useState('');
  const [transmission, setTransmission] = React.useState('');
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = React.useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onFilterChange({
      search,
      carType,
      fuelType,
      transmission,
      priceRange,
    });
  };

  const handleReset = () => {
    setSearch('');
    setCarType('');
    setFuelType('');
    setTransmission('');
    setPriceRange([0, 1000]);
    
    onFilterChange({});
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search by car name or brand"
              icon={<Search className="h-5 w-5 text-gray-400" />}
              value={search}
              onChange={handleSearch}
            />
          </div>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={<SlidersHorizontal className="h-4 w-4" />}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <Button type="submit">
            Search
          </Button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <Select
              label="Car Type"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              options={[
                { value: '', label: 'All Types' },
                { value: 'SUV', label: 'SUV' },
                { value: 'Sedan', label: 'Sedan' },
                { value: 'Hatchback', label: 'Hatchback' },
                { value: 'Convertible', label: 'Convertible' },
                { value: 'Luxury', label: 'Luxury' },
              ]}
            />
            
            <Select
              label="Fuel Type"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              options={[
                { value: '', label: 'All Fuel Types' },
                { value: 'Petrol', label: 'Petrol' },
                { value: 'Diesel', label: 'Diesel' },
                { value: 'Electric', label: 'Electric' },
                { value: 'Hybrid', label: 'Hybrid' },
              ]}
            />
            
            <Select
              label="Transmission"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              options={[
                { value: '', label: 'All Transmissions' },
                { value: 'Automatic', label: 'Automatic' },
                { value: 'Manual', label: 'Manual' },
              ]}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Range ($ per day)
              </label>
              
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-24"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="number"
                  min={priceRange[0]}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-24"
                />
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleReset}
              className="md:col-span-4"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CarFilters;