import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Tables } from '../../lib/supabase';
import { useDestinations } from '../../hooks/useDestinations';
import { supabase } from '../../lib/supabase';

interface Props {
  package?: Tables['packages'];
  destinationId?: string;
  onClose: () => void;
  onSave: (pkg: Omit<Tables['packages'], 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export const AddEditPackageModal: React.FC<Props> = ({ package: pkg, destinationId: initialDestinationId, onClose, onSave }) => {
  const [title, setTitle] = useState(pkg?.title || '');
  const [description, setDescription] = useState(pkg?.description || '');
  const [duration, setDuration] = useState(pkg?.duration?.toString() || '');
  const [price, setPrice] = useState(pkg?.price?.toString() || '');
  const [mainImageUrl, setMainImageUrl] = useState(pkg?.main_image_url || '');
  const [selectedDestinationId, setSelectedDestinationId] = useState(initialDestinationId || pkg?.destination_id || '');
  const [itinerary, setItinerary] = useState<Array<{ day: number; description: string }>>([]);
  const [availablePlaces, setAvailablePlaces] = useState<Tables['places'][]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { destinations } = useDestinations();

  useEffect(() => {
    if (selectedDestinationId) {
      fetchPlaces();
    }
  }, [selectedDestinationId]);

  useEffect(() => {
    if (duration) {
      const days = parseInt(duration);
      setItinerary(prev => {
        const newItinerary = [...prev];
        // Add or remove days based on duration
        if (newItinerary.length < days) {
          for (let i = newItinerary.length + 1; i <= days; i++) {
            newItinerary.push({ day: i, description: '' });
          }
        } else if (newItinerary.length > days) {
          return newItinerary.slice(0, days);
        }
        return newItinerary;
      });
    }
  }, [duration]);

  const fetchPlaces = async () => {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('destination_id', selectedDestinationId);

      if (error) throw error;
      setAvailablePlaces(data || []);
    } catch (err) {
      console.error('Error fetching places:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedDestinationId) {
      setError('Please select a destination');
      setLoading(false);
      return;
    }

    if (itinerary.some(day => !day.description.trim())) {
      setError('Please provide description for all days');
      setLoading(false);
      return;
    }

    try {
      const packageData = {
        destination_id: selectedDestinationId,
        title,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
        rating: pkg?.rating || 0,
        main_image_url: mainImageUrl
      };

      await onSave(packageData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleItineraryChange = (day: number, description: string) => {
    setItinerary(prev => 
      prev.map(item => 
        item.day === day ? { ...item, description } : item
      )
    );
  };

  const handlePlaceToggle = (placeId: string) => {
    setSelectedPlaces(prev => 
      prev.includes(placeId)
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {pkg ? 'Edit Package' : 'Add Package'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <select
                value={selectedDestinationId}
                onChange={(e) => setSelectedDestinationId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select destination</option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>{dest.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image URL
            </label>
            <input
              type="url"
              value={mainImageUrl}
              onChange={(e) => setMainImageUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Places Included
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {availablePlaces.map((place) => (
                <div 
                  key={place.id}
                  className={`border p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPlaces.includes(place.id)
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 hover:border-cyan-200'
                  }`}
                  onClick={() => handlePlaceToggle(place.id)}
                >
                  <div className="flex items-center">
                    <img
                      src={place.image_url}
                      alt={place.name}
                      className="w-12 h-12 rounded object-cover mr-3"
                    />
                    <div>
                      <div className="font-medium">{place.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Day-by-Day Itinerary
            </label>
            <div className="space-y-4">
              {itinerary.map((day) => (
                <div key={day.day} className="border rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day {day.day}
                  </label>
                  <textarea
                    value={day.description}
                    onChange={(e) => handleItineraryChange(day.day, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={2}
                    placeholder={`Describe the activities for day ${day.day}`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded-lg ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-700'
              }`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};