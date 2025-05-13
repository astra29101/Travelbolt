import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, AlertCircle, Calendar, User, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../hooks/useBookings';

interface BookingData {
  packageId: string;
  packageTitle: string;
  guideId: string;
  guideName: string;
  startDate: string;
  endDate: string;
  totalCost: number;
}

const BookingConfirmationPage: React.FC = () => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createBooking } = useBookings();

  useEffect(() => {
    const data = sessionStorage.getItem('bookingData');
    
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      navigate('/destinations');
    }
  }, [navigate]);

  const handleConfirm = async () => {
    if (!bookingData || !user) return;

    setIsBooking(true);
    setError('');
    
    try {
      await createBooking({
        user_id: user.id,
        package_id: bookingData.packageId,
        guide_id: bookingData.guideId,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        total_cost: bookingData.totalCost,
        status: 'confirmed'
      });

      setIsBooked(true);
      sessionStorage.removeItem('bookingData');
    } catch (err) {
      setError('An error occurred while confirming your booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  // Format dates for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No booking information found</h2>
          <Link to="/destinations" className="text-cyan-600 hover:text-cyan-800">
            Browse destinations
          </Link>
        </div>
      </div>
    );
  }

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-3">
                  <Check className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-3">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-8">
                Your trip to {bookingData.packageTitle} has been successfully booked.
                We've sent a confirmation email to {user?.email}.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Link 
                  to="/bookings"
                  className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  View My Bookings
                </Link>
                <Link 
                  to="/"
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Booking</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-cyan-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Package</p>
                    <p className="font-medium text-gray-800">{bookingData.packageTitle}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User className="h-5 w-5 text-cyan-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Guide</p>
                    <p className="font-medium text-gray-800">{bookingData.guideName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-cyan-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Travel Dates</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(bookingData.startDate)} - {formatDate(bookingData.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-bold text-lg">₹{bookingData.totalCost.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">
                  * This includes package price and guide fee for the duration of your trip.
                </p>
                
                <button
                  onClick={handleConfirm}
                  disabled={isBooking}
                  className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
                    isBooking 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-cyan-600 hover:bg-cyan-700'
                  }`}
                >
                  {isBooking ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;