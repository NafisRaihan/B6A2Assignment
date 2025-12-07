export interface User {
  id: number;
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'customer';
  created_at: Date;
  updated_at: Date;
}

export interface Vehicle {
  id: number;
  name: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Booking {
  id: number;
  user_id: number;
  vehicle_id: number;
  start_date: Date;
  end_date: Date;
  total_cost: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  id: number;
  email: string;
  role: 'admin' | 'customer';
}
