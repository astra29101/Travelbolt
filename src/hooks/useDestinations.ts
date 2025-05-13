import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../lib/supabase';

export function useDestinations() {
  const [destinations, setDestinations] = useState<Tables['destinations'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDestinations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addDestination = async (destination: Omit<Tables['destinations'], 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .insert([destination])
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setDestinations(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding destination:', err);
      throw err;
    }
  };

  const updateDestination = async (id: string, updates: Partial<Tables['destinations']>) => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setDestinations(prev => prev.map(d => d.id === id ? data : d));
      return data;
    } catch (err) {
      console.error('Error updating destination:', err);
      throw err;
    }
  };

  const deleteDestination = async (id: string) => {
    try {
      const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setDestinations(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting destination:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return {
    destinations,
    loading,
    error,
    addDestination,
    updateDestination,
    deleteDestination,
    refetch: fetchDestinations
  };
}