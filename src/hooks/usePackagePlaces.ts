import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function usePackagePlaces(packageId?: string) {
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSelectedPlaces = async () => {
    if (!packageId) {
      setSelectedPlaces([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('package_places')
        .select('place_id')
        .eq('package_id', packageId);

      if (error) throw error;
      setSelectedPlaces(data.map(item => item.place_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updatePackagePlaces = async (placeIds: string[]) => {
    if (!packageId) return;

    try {
      // Delete existing places
      await supabase
        .from('package_places')
        .delete()
        .eq('package_id', packageId);

      // Insert new places
      if (placeIds.length > 0) {
        const { error } = await supabase
          .from('package_places')
          .insert(placeIds.map(placeId => ({
            package_id: packageId,
            place_id: placeId
          })));

        if (error) throw error;
      }

      setSelectedPlaces(placeIds);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchSelectedPlaces();
  }, [packageId]);

  return {
    selectedPlaces,
    loading,
    error,
    updatePackagePlaces,
    refetch: fetchSelectedPlaces
  };
}