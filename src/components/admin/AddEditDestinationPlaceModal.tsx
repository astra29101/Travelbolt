import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Tables } from '../../lib/supabase';

interface Props {
  place?: Tables['destination_places'];
  destinationId: string;
  onClose: () => void;
  onSave: (place: Omit<Tables['destination_places'], 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export const AddEditDestinationPlaceModal: React.FC<Props> = ({ place, destinationId, onClose, onSave }) => {
  const [name, setName] = useState(place?.name || '');
  const [description, setDescription] = useState(place?.description || '');
  const [imageUrl, setImageUrl] = useState(place?.image_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!destinationId) {
      setError('Please select a destination');
      return;
    }

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }

    setLoading(true);

    try {
      await onSave({
        destination_id: destinationId,
        name: name.trim(),
        description: description.trim(),
        image_url: imageUrl.trim()
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {place ? 'Edit Place' : 'Add Place'}
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !destinationId}
              className={`px-4 py-2 text-white rounded-lg ${
                loading || !destinationId
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