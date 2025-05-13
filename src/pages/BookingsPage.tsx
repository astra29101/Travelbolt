import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Calendar, Clock, MapPin, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../hooks/useBookings';

const BookingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const { user } = useAuth();
  const { bookings, loading, error, updateBookingStatus } = useBookings(user?.id);

  // Filter bookings based on active tab
  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeTab);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await updateBookingStatus(bookingId, 'cancelled');
        setSelectedBooking(null);
      } catch (err) {
        console.error('Error cancelling booking:', err);
        alert('Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">Loading bookings...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex justify-center items-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-medium">Error loading bookings</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>
          
          {/* Tabs */}
          <div className="bg-white rounded-t-xl shadow-sm mb-6">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-3 font-medium whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'border-b-2 border-cyan-600 text-cyan-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Bookings
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-3 font-medium whitespace-nowrap ${
                  activeTab === 'upcoming'
                    ? 'border-b-2 border-cyan-600 text-cyan-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-3 font-medium whitespace-nowrap ${
                  activeTab === 'completed'
                    ? 'border-b-2 border-cyan-600 text-cyan-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`px-4 py-3 font-medium whitespace-nowrap ${
                  activeTab === 'cancelled'
                    ? 'border-b-2 border-cyan-600 text-cyan-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
          
          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            <div className="bg-white rounded-b-xl shadow-md">
              {filteredBookings.map((booking, index) => (
                <div 
                  key={booking.id}
                  className={`${
                    index !== filteredBookings.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 mb-4 md:mb-0">
                        <div className="relative h-40 rounded-lg overflow-hidden">
                          <img 
                            src={booking.packages?.main_image_url} 
                            alt={booking.packages?.title}
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-3/4 md:pl-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{booking.packages?.title}</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-500">Destination</p>
                              <p className="font-medium">{booking.packages?.destinations?.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-500">Travel Dates</p>
                              <p className="font-medium">{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-500">Guide</p>
                              <p className="font-medium">{booking.guides?.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-500">Duration</p>
                              <p className="font-medium">
                                {Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Total Cost</p>
                            <p className="text-lg font-bold text-cyan-700">₹{booking.total_cost.toLocaleString()}</p>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-colors flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </button>
                            
                            {booking.status === 'upcoming' && (
                              <Link
                                to={`/packages/${booking.package_id}`}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Package Info
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">You don't have any {activeTab !== 'all' ? activeTab : ''} bookings.</p>
              <Link 
                to="/destinations"
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors inline-block"
              >
                Browse Destinations
              </Link>
            </div>
          )}
          
          {/* Booking Details Modal */}
          {selectedBooking && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="inline-block w-full max-w-2xl overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle">
                  <div className="relative">
                    <img 
                      src={selectedBooking.packages?.main_image_url} 
                      alt={selectedBooking.packages?.title}
                      className="w-full h-48 object-cover"
                    />
                    <button 
                      onClick={() => setSelectedBooking(null)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{selectedBooking.packages?.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedBooking.status)}`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-cyan-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Destination</p>
                          <p className="font-medium">{selectedBooking.packages?.destinations?.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-cyan-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Travel Dates</p>
                          <p className="font-medium">{formatDate(selectedBooking.start_date)} - {formatDate(selectedBooking.end_date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-cyan-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Guide</p>
                          <p className="font-medium">{selectedBooking.guides?.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-cyan-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">
                            {Math.ceil((new Date(selectedBooking.end_date).getTime() - new Date(selectedBooking.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Package Price:</span>
                        <span>₹{(selectedBooking.total_cost * 0.75).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Guide Fee:</span>
                        <span>₹{(selectedBooking.total_cost * 0.25).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
                        <span>Total:</span>
                        <span className="text-cyan-700">₹{selectedBooking.total_cost.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                      {selectedBooking.status === 'upcoming' && (
                        <button 
                          onClick={() => handleCancelBooking(selectedBooking.id)}
                          className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
                      
                      <Link 
                        to={`/packages/${selectedBooking.package_id}`}
                        className="px-4 py-2 bg-cyan-600 text-white text-center rounded-lg hover:bg-cyan-700 transition-colors"
                      >
                        View Package
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;