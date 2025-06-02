import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useCarsStore } from '../../store/useCarsStore';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import api from '../../lib/api';

type CarFormValues = {
  name: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  car_type: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  mileage: number;
  image_url: string;
  description: string;
};

const ManageCarsPage: React.FC = () => {
  const { cars, fetchCars } = useCarsStore();
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [editingCar, setEditingCar] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CarFormValues>();

  const onSubmit = async (data: CarFormValues) => {
    try {
      const carData = {
        ...data,
        id: `car_${Date.now()}`,
        rating: 0,
        has_ac: true,
        images: [],
        created_at: new Date().toISOString()
      };

      const response = await api.post('/cars', carData);

      if (response.status !== 200) {
        throw new Error('Failed to add car');
      }

      toast.success('Car added successfully!');
      setIsAddingCar(false);
      setEditingCar(null);
      reset();
      fetchCars();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add car');
    }
  };

  const handleDelete = async (carId: string) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      const response = await api.delete(`/cars/${carId}`);
      
      if (response.status !== 200) {
        throw new Error('Failed to delete car');
      }

      toast.success('Car deleted successfully');
      fetchCars();
    } catch (err) {
      toast.error('Failed to delete car');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Cars
        </h2>
        <Button onClick={() => setIsAddingCar(!isAddingCar)} icon={<Plus className="h-4 w-4" />}>
          Add New Car
        </Button>
      </div>

      {(isAddingCar || editingCar) && (
        <Card className="mb-8">
          <CardContent>
            <h3 className="text-xl font-semibold mb-4">
              {editingCar ? 'Edit Car' : 'Add New Car'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  {...register('name', { required: 'Name is required' })}
                  error={errors.name?.message}
                />
                <Input
                  label="Brand"
                  {...register('brand', { required: 'Brand is required' })}
                  error={errors.brand?.message}
                />
                <Input
                  label="Model"
                  {...register('model', { required: 'Model is required' })}
                  error={errors.model?.message}
                />
                <Input
                  type="number"
                  label="Year"
                  {...register('year', {
                    required: 'Year is required',
                    min: { value: 1900, message: 'Invalid year' }
                  })}
                  error={errors.year?.message}
                />
                <Input
                  type="number"
                  label="Price per Day"
                  {...register('price_per_day', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Must be positive' }
                  })}
                  error={errors.price_per_day?.message}
                />
                <Select
                  label="Car Type"
                  {...register('car_type', { required: 'Car type is required' })}
                  error={errors.car_type?.message}
                  options={[
                    { value: 'Sedan', label: 'Sedan' },
                    { value: 'SUV', label: 'SUV' },
                    { value: 'Sports', label: 'Sports' },
                    { value: 'Convertible', label: 'Convertible' },
                    { value: 'Hatchback', label: 'Hatchback' }
                  ]}
                />
                <Select
                  label="Transmission"
                  {...register('transmission')}
                  options={[
                    { value: 'Automatic', label: 'Automatic' },
                    { value: 'Manual', label: 'Manual' }
                  ]}
                />
                <Select
                  label="Fuel Type"
                  {...register('fuel_type')}
                  options={[
                    { value: 'Petrol', label: 'Petrol' },
                    { value: 'Diesel', label: 'Diesel' },
                    { value: 'Electric', label: 'Electric' },
                    { value: 'Hybrid', label: 'Hybrid' }
                  ]}
                />
                <Input
                  type="number"
                  label="Seats"
                  {...register('seats', {
                    required: 'Seats are required',
                    min: { value: 1, message: 'Minimum 1 seat' }
                  })}
                  error={errors.seats?.message}
                />
                <Input type="number" label="Mileage" {...register('mileage')} />
                <Input
                  label="Image URL"
                  {...register('image_url', { required: 'Image URL is required' })}
                  error={errors.image_url?.message}
                />
              </div>

              <Textarea
                label="Description"
                {...register('description')}
                rows={4}
              />

              <div className="flex gap-4">
                <Button type="submit" isLoading={isSubmitting}>
                  {editingCar ? 'Update Car' : 'Add Car'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingCar(false);
                    setEditingCar(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Card key={car.id}>
            <img
              src={car.image_url}
              alt={car.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardContent>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{car.name}</h3>
                <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  ${car.price_per_day}/day
                </span>
              </div>
              <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <p>{car.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>Type: {car.car_type}</div>
                  <div>Transmission: {car.transmission}</div>
                  <div>Fuel: {car.fuel_type}</div>
                  <div>Seats: {car.seats}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingCar(car.id)}
                  icon={<Edit className="h-4 w-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(car.id)}
                  icon={<Trash className="h-4 w-4" />}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageCarsPage;