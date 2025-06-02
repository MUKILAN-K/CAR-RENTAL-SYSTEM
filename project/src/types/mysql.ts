export interface Car {
  id: string;
  created_at: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  price_per_day: number;
  car_type: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  mileage: number;
  has_ac: boolean;
  image_url: string;
  images: string[];
  rating: number;
  available: boolean;
}

export interface Booking {
  id: string;
  created_at: string;
  car_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  car_name?: string;
  car_image?: string;
  user_name?: string;
  user_email?: string;
}

export interface Profile {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
  role: string;
}

export interface Review {
  id: string;
  created_at: string;
  car_id: string;
  user_id: string;
  rating: number;
  comment: string;
}