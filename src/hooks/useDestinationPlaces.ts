import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../lib/supabase';

export function useDestinationPlaces() {
  const [places, setPlaces] = useState<Tables['destination_places'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = async () => {
    try {
      const { data, error } = await supabase
        .from('destination_places')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaces(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addPlace = async (place: Omit<Tables['destination_places'], 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!place.destination_id) {
        throw new Error('Destination ID is required');
      }

      const { data, error } = await supabase
        .from('destination_places')
        .insert([place])
        .select()
        .single();

      if (error) throw error;
      setPlaces(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding place:', err);
      throw err;
    }
  };

  const updatePlace = async (id: string, updates: Partial<Tables['destination_places']>) => {
    try {
      const { data, error } = await supabase
        .from('destination_places')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPlaces(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      console.error('Error updating place:', err);
      throw err;
    }
  };

  const deletePlace = async (id: string) => {
    try {
      const { error } = await supabase
        .from('destination_places')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPlaces(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting place:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return {
    places,
    loading,
    error,
    addPlace,
    updatePlace,
    deletePlace,
    refetch: fetchPlaces
  };
}