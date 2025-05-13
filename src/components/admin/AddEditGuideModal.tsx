import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Tables } from '../../lib/supabase';
import { useDestinations } from '../../hooks/useDestinations';

interface Props {
  guide?: Tables['guides'];
  destinationId?: string;
  onClose: () => void;
  onSave: (guide: Omit<Tables['guides'], 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export const AddEditGuideModal: React.FC<Props> = ({ guide, destinationId: initialDestinationId, onClose, onSave }) => {
  const [name, setName] = useState(guide?.name || '');
  const [email, setEmail] = useState(guide?.email || '');
  const [experienceYears, setExperienceYears] = useState(guide?.experience_years?.toString() || '');
  const [languages, setLanguages] = useState<string[]>(guide?.languages || []);
  const [pricePerDay, setPricePerDay] = useState(guide?.price_per_day?.toString() || '');
  const [imageUrl, setImageUrl] = useState(guide?.image_url || '');
  const [selectedDestinationId, setSelectedDestinationId] = useState(initialDestinationId || guide?.destination_id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { destinations } = useDestinations();

  useEffect(() => {
    if (!selectedDestinationId && destinations.length > 0) {
      setSelectedDestinationId(destinations[0].id);
    }
  }, [destinations]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLanguages(value.split(',').map(lang => lang.trim()).filter(Boolean));
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

    try {
      await onSave({
        destination_id: selectedDestinationId,
        name,
        email,
        experience_years: parseInt(experienceYears),
        languages,
        rating: guide?.rating || 0,
        price_per_day: parseFloat(pricePerDay),
        image_url: imageUrl
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
            {guide ? 'Edit Guide' : 'Add Guide'}
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
                  <option key={dest.id} value={dest.id}>
                    {dest.name}
                  </option>
                ))}
              </select>
            </div>

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
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years)
                </label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Day
                </label>
                <input
                  type="number"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Languages (comma-separated)
              </label>
              <input
                type="text"
                value={languages.join(', ')}
                onChange={handleLanguageChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="English, Hindi, French"
                required
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