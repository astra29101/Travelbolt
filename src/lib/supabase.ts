import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export types for better TypeScript support
export type Tables = {
  users: {
    id: string;
    name: string;
    email: string;
    password: string;
    age?: number;
    location?: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
  };
  destinations: {
    id: string;
    name: string;
    description: string;
    category: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
  };
  places: {
    id: string;
    destination_id: string;
    name: string;
    description?: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
  };
  packages: {
    id: string;
    destination_id: string;
    title: string;
    description?: string;
    duration: number;
    price: number;
    rating: number;
    main_image_url?: string;
    created_at: string;
    updated_at: string;
  };
  guides: {
    id: string;
    destination_id: string;
    name: string;
    email: string;
    experience_years: number;
    languages: string[];
    rating: number;
    price_per_day: number;
    image_url?: string;
    created_at: string;
    updated_at: string;
  };
  bookings: {
    id: string;
    user_id: string;
    package_id: string;
    guide_id: string;
    start_date: string;
    end_date: string;
    status: string;
    total_cost: number;
    created_at: string;
    updated_at: string;
  };
};
