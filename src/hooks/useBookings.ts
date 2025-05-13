import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../lib/supabase';

export function useBookings(userId?: string | null) {
  const [bookings, setBookings] = useState<Tables['bookings'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          packages (
            id,
            title,
            main_image_url,
            destination_id,
            destinations (
              name
            )
          ),
          guides (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      // Only apply the user_id filter if a valid UUID string is provided
      if (userId && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (booking: Omit<Tables['bookings'], 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single();

      if (error) throw error;
      setBookings(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating booking:', err);
      throw err;
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setBookings(prev => prev.map(b => b.id === id ? data : b));
      return data;
    } catch (err) {
      console.error('Error updating booking status:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    refetch: fetchBookings
  };
}