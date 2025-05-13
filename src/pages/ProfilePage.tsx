import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Mail, Calendar, PencilLine, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [location, setLocation] = useState(user?.location || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, this would update the user in the database
      setIsSaving(false);
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    }, 1000);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-24"></div>
                <div className="px-6 pb-6">
                  <div className="flex justify-center -mt-12 mb-4">
                    <div className="rounded-full bg-white p-1 shadow-lg">
                      <div className="bg-cyan-100 rounded-full h-24 w-24 flex items-center justify-center">
                        <User className="h-12 w-12 text-cyan-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    {user.age && (
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-600">{user.age} years old</span>
                      </div>
                    )}
                    
                    {user.location && (
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-600">{user.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2 rounded-lg border border-cyan-600 text-cyan-600 hover:bg-cyan-50 transition-colors flex items-center justify-center"
                    >
                      <PencilLine className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full mt-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Edit Profile Form / Dashboard */}
            <div className="md:col-span-2">
              {isEditing ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email (cannot be changed)
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                          Age
                        </label>
                        <input
                          id="age"
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                          min={18}
                        />
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          id="location"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-lg text-white flex items-center ${
                          isSaving 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-cyan-600 hover:bg-cyan-700'
                        }`}
                      >
                        {isSaving ? (
                          <>Saving...</>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-cyan-50 rounded-lg p-4">
                      <h3 className="font-medium text-cyan-800 mb-1">Upcoming Trips</h3>
                      <p className="text-3xl font-bold text-cyan-700">2</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-green-800 mb-1">Completed Trips</h3>
                      <p className="text-3xl font-bold text-green-700">5</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3">Recent Activity</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-medium text-gray-800">Booking Confirmed</p>
                        <p className="text-gray-600">Goa Beach Retreat</p>
                        <p className="text-sm text-gray-500 mt-1">2 days ago</p>
                      </div>
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-medium text-gray-800">Profile Updated</p>
                        <p className="text-gray-600">You updated your profile information</p>
                        <p className="text-sm text-gray-500 mt-1">5 days ago</p>
                      </div>
                      <div className="p-4">
                        <p className="font-medium text-gray-800">Review Submitted</p>
                        <p className="text-gray-600">Manali Adventure</p>
                        <p className="text-sm text-gray-500 mt-1">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Quick Links</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button 
                        onClick={() => navigate('/bookings')}
                        className="p-3 bg-gray-100 rounded-lg text-left hover:bg-gray-200 transition-colors"
                      >
                        <span className="font-medium">My Bookings</span>
                        <p className="text-sm text-gray-600">View all your trips</p>
                      </button>
                      <button 
                        onClick={() => navigate('/destinations')}
                        className="p-3 bg-gray-100 rounded-lg text-left hover:bg-gray-200 transition-colors"
                      >
                        <span className="font-medium">Browse Destinations</span>
                        <p className="text-sm text-gray-600">Find your next adventure</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;