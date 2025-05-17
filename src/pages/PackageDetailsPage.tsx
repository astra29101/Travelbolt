import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Star, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePackages } from '../hooks/usePackages';
import { useGuides } from '../hooks/useGuides';
import { supabase } from '../lib/supabase';
import type { Tables } from '../lib/supabase';

interface DestinationPlace {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface Itinerary {
  day_number: number;
  description: string;
}

const PackageDetailsPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  const [mainImage, setMainImage] = useState('');
  const [destinationPlaces, setDestinationPlaces] = useState<DestinationPlace[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary[]>([]);
  const [guideAvailable, setGuideAvailable] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { packages, loading: packagesLoading } = usePackages();
  const { guides, loading: guidesLoading } = useGuides();
  
  const packageDetails = packages.find(p => p.id === packageId);

  useEffect(() => {
    if (packageDetails && !mainImage) {
      setMainImage(packageDetails.main_image_url);
    }
  }, [packageDetails, mainImage]);

  useEffect(() => {
    if (startDate && packageDetails) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + packageDetails.duration - 1);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate, packageDetails?.duration]);

  useEffect(() => {
    if (packageDetails?.destination_id) {
      fetchDestinationPlaces();
    }
  }, [packageDetails?.destination_id]);

  useEffect(() => {
    if (packageId) {
      fetchItinerary();
    }
  }, [packageId]);

  useEffect(() => {
    if (selectedGuide && startDate && endDate) {
      checkGuideAvailability();
    }
  }, [selectedGuide, startDate, endDate]);

  const fetchDestinationPlaces = async () => {
    try {
      const { data, error } = await supabase
        .from('destination_places')
        .select('*')
        .eq('destination_id', packageDetails?.destination_id);

      if (error) throw error;
      setDestinationPlaces(data || []);
    } catch (err) {
      console.error('Error fetching destination places:', err);
    }
  };

  const fetchItinerary = async () => {
    try {
      const { data, error } = await supabase
        .from('package_itinerary')
        .select('*')
        .eq('package_id', packageId)
        .order('day_number');

      if (error) throw error;
      setItinerary(data || []);
    } catch (err) {
      console.error('Error fetching itinerary:', err);
    }
  };

  const checkGuideAvailability = async () => {
    try {
      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('guide_id', selectedGuide)
        .overlaps('start_date', [startDate])
        .overlaps('end_date', [endDate]);

      if (error) throw error;
      setGuideAvailable(!existingBookings?.length);
    } catch (err) {
      console.error('Error checking guide availability:', err);
    }
  };

  const handleBookNow = () => {
    if (!startDate || !selectedGuide) {
      alert('Please select travel dates and a guide to continue.');
      return;
    }

    if (!guideAvailable) {
      alert('Selected guide is not available for these dates. Please choose different dates or another guide.');
      return;
    }

    const selectedGuideDetails = guides.find(g => g.id === selectedGuide);

    const bookingData = {
      packageId: packageDetails?.id,
      packageTitle: packageDetails?.title,
      guideId: selectedGuide,
      guideName: selectedGuideDetails?.name,
      startDate,
      endDate,
      totalCost: calculateTotalCost()
    };

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

    if (user) {
      navigate('/booking-confirmation');
    } else {
      navigate('/login', { state: { from: '/booking-confirmation' } });
    }
  };

  const calculateTotalCost = () => {
    const packageCost = packageDetails?.price || 0;
    const selectedGuideDetails = guides.find(g => g.id === selectedGuide);
    const guideCost = selectedGuideDetails 
      ? selectedGuideDetails.price_per_day * (packageDetails?.duration || 0)
      : 0;
    
    return packageCost + guideCost;
  };

  if (packagesLoading || guidesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">Loading package details...</h2>
        </div>
      </div>
    );
  }

  if (!packageDetails) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Package not found</h2>
          <Link to="/destinations" className="text-cyan-600 hover:text-cyan-800">
            ← Back to all destinations
          </Link>
        </div>
      </div>
    );
  }

  const availableGuides = guides.filter(g => g.destination_id === packageDetails.destination_id);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link 
          to={`/destinations/${packageDetails.destination_id}`} 
          className="inline-flex items-center text-cyan-600 hover:text-cyan-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to packages
        </Link>

        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{packageDetails.title}</h1>
            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="h-5 w-5 text-yellow-500 mr-1 fill-current" />
              <span className="font-medium">{packageDetails.rating} rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="relative aspect-[16/9]">
                <img 
                  src={mainImage || packageDetails.main_image_url} 
                  alt={packageDetails.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* {destinationPlaces.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Places to Visit</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destinationPlaces.map(place => (
                    <div key={place.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img 
                        src={place.image_url} 
                        alt={place.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-2">{place.name}</h3>
                        <p className="text-gray-600 text-sm">{place.description}</p>
                      </div>
                    </div>
                  ))}
                </div> */}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-2xl font-bold text-cyan-700 mb-2">
                  ₹{packageDetails.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-600"> / per person</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{packageDetails.duration} days</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Guide
                  </label>
                  <div className="space-y-2">
                    {availableGuides.map((guide) => (
                      <div 
                        key={guide.id}
                        className={`border p-3 rounded-md cursor-pointer transition-colors ${
                          selectedGuide === guide.id 
                            ? 'border-cyan-500 bg-cyan-50' 
                            : 'border-gray-200 hover:border-cyan-200'
                        }`}
                        onClick={() => setSelectedGuide(guide.id)}
                      >
                        <div className="flex items-center">
                          <img 
                            src={guide.image_url} 
                            alt={guide.name}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <div className="font-medium">{guide.name}</div>
                            <div className="text-sm text-gray-600">
                              ₹{guide.price_per_day}/day - {guide.experience_years} yrs exp
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!guideAvailable && selectedGuide && startDate && (
                  <div className="text-red-600 text-sm">
                    This guide is not available for the selected dates.
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span>Package Price:</span>
                    <span>₹{packageDetails.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Guide Fee:</span>
                    <span>
                      {selectedGuide 
                        ? `₹${(guides.find(g => g.id === selectedGuide)!.price_per_day * packageDetails.duration).toLocaleString()}`
                        : '₹0'}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
                    <span>Total:</span>
                    <span>₹{calculateTotalCost().toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    !startDate || !selectedGuide || !guideAvailable
                      ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      : 'bg-cyan-600 text-white hover:bg-cyan-700'
                  }`}
                  disabled={!startDate || !selectedGuide || !guideAvailable}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-b-2 border-cyan-600 text-cyan-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'itinerary'
                  ? 'border-b-2 border-cyan-600 text-cyan-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Itinerary
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Package Overview</h2>
              <p className="text-gray-700 mb-6">{packageDetails.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-cyan-600 mr-2" />
                    <h3 className="font-medium">Duration</h3>
                  </div>
                  <p className="text-gray-700">{packageDetails.duration} days</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-cyan-600 mr-2" />
                    <h3 className="font-medium">Guide</h3>
                  </div>
                  <p className="text-gray-700">Professional guide included</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-cyan-600 mr-2" />
                    <h3 className="font-medium">Transport</h3>
                  </div>
                  <p className="text-gray-700">Included</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Day-by-Day Itinerary</h2>
              <div className="space-y-6">
                {itinerary.map((day) => (
                  <div key={day.day_number} className="border-l-4 border-cyan-600 pl-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      Day {day.day_number}
                    </h3>
                    <p className="text-gray-700">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsPage;