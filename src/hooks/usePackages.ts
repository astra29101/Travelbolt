import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../lib/supabase';

export function usePackages(destinationId?: string) {
  const [packages, setPackages] = useState<Tables['packages'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    try {
      let query = supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (destinationId) {
        query = query.eq('destination_id', destinationId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPackages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addPackage = async (pkg: Omit<Tables['packages'], 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([pkg])
        .select()
        .single();

      if (error) throw error;
      setPackages(prev => [data, ...prev]);
      return data; // Return the newly created package
    } catch (err) {
      console.error('Error adding package:', err);
      throw err;
    }
  };

  const updatePackage = async (id: string, updates: Partial<Tables['packages']>) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPackages(prev => prev.map(p => p.id === id ? data : p));
      return data; // Return the updated package
    } catch (err) {
      console.error('Error updating package:', err);
      throw err;
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPackages(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting package:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [destinationId]);

  return {
    packages,
    loading,
    error,
    addPackage,
    updatePackage,
    deletePackage,
    refetch: fetchPackages
  };
}