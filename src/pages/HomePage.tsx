import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, MapPin } from 'lucide-react';
import { useDestinations } from '../hooks/useDestinations';
import { usePackages } from '../hooks/usePackages';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { destinations, loading: destinationsLoading } = useDestinations();
  const { packages, loading: packagesLoading } = usePackages();

  const featuredDestinations = destinations.slice(0, 4);
  const topPackages = packages
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (destinationsLoading || packagesLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div 
        className="relative bg-cover bg-center h-screen flex items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)` 
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-fade-in">
            Discover Your Perfect Journey
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
            Explore breathtaking destinations and create memories that last a lifetime
          </p>
          
          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="max-w-lg mx-auto relative mb-8 transition-all duration-300 transform hover:scale-105"
          >
            <input
              type="text"
              placeholder="Where would you like to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 pl-12 pr-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-lg"
            />
            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-500" />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-cyan-600 text-white py-2 px-6 rounded-full hover:bg-cyan-700 transition-colors"
            >
              Search
            </button>
          </form>
          
          <div className="flex justify-center mt-8">
            <Link 
              to="/destinations" 
              className="bg-white text-cyan-700 py-3 px-8 rounded-full font-bold hover:bg-gray-100 transition-colors flex items-center"
            >
              Explore Destinations 
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Featured Destinations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of the most beautiful destinations
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination) => (
              <Link 
                to={`/destinations/${destination.id}`} 
                key={destination.id}
                className="group rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64">
                  <img 
                    src={destination.image_url} 
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <span className="inline-block px-3 py-1 bg-cyan-600 text-xs rounded-full mb-2">
                      {destination.category}
                    </span>
                    <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{destination.description}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/destinations" 
              className="inline-flex items-center text-cyan-600 font-semibold hover:text-cyan-800 transition-colors"
            >
              View All Destinations 
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Packages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Top Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular and highest-rated travel packages
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl">
                <div className="relative h-60">
                  <img 
                    src={pkg.main_image_url} 
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-cyan-700">
                    ₹{pkg.price.toLocaleString()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.title}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">{pkg.duration} days</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-gray-700">{pkg.rating}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/packages/${pkg.id}`} 
                    className="w-full block text-center py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
                  >
                    View Package
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/destinations" 
              className="inline-flex items-center text-cyan-600 font-semibold hover:text-cyan-800 transition-colors"
            >
              Explore All Packages 
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best travel experiences with attention to every detail
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Handpicked Destinations</h3>
              <p className="text-gray-600">
                We carefully select each destination to ensure exceptional experiences for our travelers.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Personalized Itineraries</h3>
              <p className="text-gray-600">
                Each trip is customized according to your preferences and travel style.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Support className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our team is available round the clock to assist you throughout your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section 
        className="py-16 bg-cover bg-center text-white"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)` 
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Sign up today and get exclusive access to our special offers and discounts.
          </p>
          <Link 
            to="/signup" 
            className="bg-white text-cyan-700 py-3 px-8 rounded-full font-bold hover:bg-gray-100 transition-colors inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

const Calendar: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Support: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default HomePage;