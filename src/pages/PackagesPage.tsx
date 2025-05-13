import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Star } from 'lucide-react';
import { useDestinations } from '../hooks/useDestinations';
import { usePackages } from '../hooks/usePackages';

const PackagesPage: React.FC = () => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const { destinations, loading: destinationsLoading, error: destinationsError } = useDestinations();
  const { packages, loading: packagesLoading, error: packagesError } = usePackages(destinationId);
  
  const destination = destinations.find(d => d.id === destinationId);

  if (destinationsLoading || packagesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (destinationsError || packagesError || !destination) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {destinationsError || packagesError || 'Destination not found'}
          </h2>
          <Link to="/destinations" className="text-cyan-600 hover:text-cyan-800">
            ← Back to all destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Link 
          to="/destinations" 
          className="inline-flex items-center text-cyan-600 hover:text-cyan-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all destinations
        </Link>

        {/* Destination Header */}
        <div className="relative rounded-xl overflow-hidden mb-12 shadow-lg">
          <img 
            src={destination.image_url} 
            alt={destination.name}
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{destination.name}</h1>
            <p className="text-lg max-w-2xl">{destination.description}</p>
          </div>
        </div>

        {/* Packages Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Packages</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="md:flex">
                  <div className="md:w-2/5">
                    <img 
                      src={pkg.main_image_url} 
                      alt={pkg.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-6 md:w-3/5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{pkg.title}</h3>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-sm">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                        <span className="font-medium">{pkg.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-3 text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{pkg.duration} days</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-cyan-700">
                        <span className="font-bold text-lg">₹{pkg.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-600"> / per person</span>
                      </div>
                      <Link 
                        to={`/packages/${pkg.id}`}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;