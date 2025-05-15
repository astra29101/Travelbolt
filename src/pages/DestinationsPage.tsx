import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useDestinations } from '../hooks/useDestinations';
import { supabase } from '../lib/supabase';

const categories = ['All', 'Beaches', 'Mountains', 'Historical', 'Nature'];

interface DestinationPlace {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const DestinationsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]);
  const [expandedDestination, setExpandedDestination] = useState<string | null>(null);
  const [destinationPlaces, setDestinationPlaces] = useState<Record<string, DestinationPlace[]>>({});
  
  const { destinations, loading, error } = useDestinations();

  useEffect(() => {
    let filtered = destinations;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(dest => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(dest => dest.category === activeCategory);
    }

    setFilteredDestinations(filtered);
  }, [searchQuery, activeCategory, destinations]);

  const fetchDestinationPlaces = async (destinationId: string) => {
    try {
      const { data, error } = await supabase
        .from('destination_places')
        .select('*')
        .eq('destination_id', destinationId);

      if (error) throw error;
      setDestinationPlaces(prev => ({
        ...prev,
        [destinationId]: data || []
      }));
    } catch (err) {
      console.error('Error fetching destination places:', err);
    }
  };

  const handleExpandDestination = (destinationId: string) => {
    if (expandedDestination === destinationId) {
      setExpandedDestination(null);
    } else {
      setExpandedDestination(destinationId);
      if (!destinationPlaces[destinationId]) {
        fetchDestinationPlaces(destinationId);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">Loading destinations...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex justify-center items-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-medium">Error loading destinations</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Discover Amazing Destinations</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of the most beautiful destinations for your next adventure
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-10">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            </div>
            <button 
              type="submit"
              className="w-full md:w-auto py-3 px-6 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="space-y-6">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((destination) => (
              <div 
                key={destination.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-full">
                    <img 
                      src={destination.image_url} 
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-cyan-600 text-white text-xs rounded-full">
                      {destination.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {destination.name}
                    </h3>
                    <div className="flex items-start mb-4">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                      <p className="text-gray-600">{destination.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Link 
                        to={`/destinations/${destination.id}`}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                      >
                        View Packages
                      </Link>
                      <button
                        onClick={() => handleExpandDestination(destination.id)}
                        className="flex items-center text-cyan-600 hover:text-cyan-800"
                      >
                        {expandedDestination === destination.id ? (
                          <>
                            Hide Places
                            <ChevronUp className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <>
                            Show Places
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Destination Places */}
                {expandedDestination === destination.id && (
                  <div className="border-t border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Places to Visit</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {destinationPlaces[destination.id]?.map((place) => (
                        <div key={place.id} className="bg-gray-50 rounded-lg overflow-hidden">
                          <img 
                            src={place.image_url} 
                            alt={place.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h5 className="font-semibold text-gray-800 mb-2">{place.name}</h5>
                            <p className="text-sm text-gray-600">{place.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No destinations found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage;