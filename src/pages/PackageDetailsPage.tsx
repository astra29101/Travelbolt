import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Utensils, Calendar, Star, Users, BedDouble, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePackages } from '../hooks/usePackages';
import { useGuides } from '../hooks/useGuides';

const PackageDetailsPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  const [mainImage, setMainImage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { packages, loading: packagesLoading } = usePackages();
  const { guides, loading: guidesLoading } = useGuides();
  
  const packageDetails = packages.find(p => p.id === packageId);
  const availableGuides = guides.filter(g => g.destination_id === packageDetails?.destination_id);
  
  // Set main image to the first image if not set
  useEffect(() => {
    if (packageDetails && !mainImage) {
      setMainImage(packageDetails.main_image_url);
    }
  }, [packageDetails, mainImage]);

  // Calculate end date based on start date and duration
  useEffect(() => {
    if (startDate && packageDetails) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + packageDetails.duration - 1);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate, packageDetails?.duration]);

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

  const handleBookNow = () => {
    if (!startDate || !selectedGuide) {
      alert('Please select travel dates and a guide to continue.');
      return;
    }

    const selectedGuideDetails = guides.find(g => g.id === selectedGuide);

    const bookingData = {
      packageId: packageDetails.id,
      packageTitle: packageDetails.title,
      guideId: selectedGuide,
      guideName: selectedGuideDetails?.name,
      startDate,
      endDate,
      totalCost: calculateTotalCost()
    };

    // Store booking data in sessionStorage for the confirmation page
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Navigate to booking confirmation page if logged in, otherwise to login
    if (user) {
      navigate('/booking-confirmation');
    } else {
      navigate('/login', { state: { from: '/booking-confirmation' } });
    }
  };

  const calculateTotalCost = () => {
    const packageCost = packageDetails.price;
    const selectedGuideDetails = guides.find(g => g.id === selectedGuide);
    const guideCost = selectedGuideDetails 
      ? selectedGuideDetails.price_per_day * packageDetails.duration
      : 0;
    
    return packageCost + guideCost;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Link 
          to={`/destinations/${packageDetails.destination_id}`} 
          className="inline-flex items-center text-cyan-600 hover:text-cyan-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to packages
        </Link>

        {/* Package Title */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-800">{packageDetails.title}</h1>
            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="h-5 w-5 text-yellow-500 mr-1 fill-current" />
              <span className="font-medium">{packageDetails.rating} rating</span>
            </div>
          </div>
        </div>

        {/* Gallery and Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Gallery */}
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
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-2xl font-bold text-cyan-700 mb-2">
                  ₹{packageDetails.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-600"> / per person</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{packageDetails.duration} days / {packageDetails.duration - 1} nights</span>
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
                    !startDate || !selectedGuide
                      ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      : 'bg-cyan-600 text-white hover:bg-cyan-700'
                  }`}
                  disabled={!startDate || !selectedGuide}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
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
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'info'
                  ? 'border-b-2 border-cyan-600 text-cyan-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Additional Info
            </button>
          </div>
        </div>

        {/* Tab Content */}
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
                  <p className="text-gray-700">{packageDetails.duration} days / {packageDetails.duration - 1} nights</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-cyan-600 mr-2" />
                    <h3 className="font-medium">Group Size</h3>
                  </div>
                  <p className="text-gray-700">Max 15 people</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-cyan-600 mr-2" />
                    <h3 className="font-medium">Season</h3>
                  </div>
                  <p className="text-gray-700">Year-round</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Check className="h-5 w-5 text-cyan-600 mr-2" />
                    <h3 className="font-medium">Included</h3>
                  </div>
                  <p className="text-gray-700">Accommodation, Breakfast, Transport</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Day-by-Day Itinerary</h2>
              <div className="space-y-6">
                {Array.from({ length: packageDetails.duration }).map((_, index) => (
                  <div key={index} className="border-l-4 border-cyan-600 pl-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      Day {index + 1}
                    </h3>
                    <p className="text-gray-700">Detailed itinerary for day {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-3">
                    <Utensils className="h-5 w-5 text-cyan-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">Food & Dining</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-2">•</span>
                      <span className="text-gray-700">Breakfast included daily</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-2">•</span>
                      <span className="text-gray-700">Local cuisine experiences</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center mb-3">
                    <BedDouble className="h-5 w-5 text-cyan-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">Accommodation</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-2">•</span>
                      <span className="text-gray-700">3-4 star hotels</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-600 mr-2">•</span>
                      <span className="text-gray-700">Twin sharing basis</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Important Notes</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-cyan-600 mr-2">•</span>
                    <span className="text-gray-700">
                      Prices are per person and may vary based on group size and season.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-600 mr-2">•</span>
                    <span className="text-gray-700">
                      Activities are subject to weather conditions and availability.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-600 mr-2">•</span>
                    <span className="text-gray-700">
                      It is recommended to book at least 30 days in advance.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-600 mr-2">•</span>
                    <span className="text-gray-700">
                      Travel insurance is not included but highly recommended.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsPage;