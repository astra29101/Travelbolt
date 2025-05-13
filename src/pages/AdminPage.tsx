import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, MapPin, Package, Users, Map, User, LogOut, 
  BarChart2, PlusCircle, Edit, Trash2, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDestinations } from '../hooks/useDestinations';
import { usePackages } from '../hooks/usePackages';
import { useGuides } from '../hooks/useGuides';
import { AddEditDestinationModal } from '../components/admin/AddEditDestinationModal';
import { AddEditPackageModal } from '../components/admin/AddEditPackageModal';
import { AddEditGuideModal } from '../components/admin/AddEditGuideModal';

// Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const { destinations } = useDestinations();
  const { packages } = usePackages();
  const { guides } = useGuides();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Total Destinations</h3>
            <MapPin className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{destinations.length}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Total Packages</h3>
            <Package className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{packages.length}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Total Guides</h3>
            <User className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{guides.length}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Active Bookings</h3>
            <Calendar className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">0</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">Recent Destinations</h3>
            <Link 
              to="/admin/destinations"
              className="text-sm text-cyan-600 hover:text-cyan-800"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {destinations.slice(0, 3).map((destination) => (
              <div key={destination.id} className="flex items-center">
                <img 
                  src={destination.image_url} 
                  alt={destination.name} 
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="ml-4 flex-grow">
                  <h4 className="text-sm font-medium text-gray-900">{destination.name}</h4>
                  <p className="text-sm text-gray-500">{destination.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-800">Recent Packages</h3>
            <Link 
              to="/admin/packages"
              className="text-sm text-cyan-600 hover:text-cyan-800"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {packages.slice(0, 3).map((pkg) => (
              <div key={pkg.id} className="flex items-center">
                <img 
                  src={pkg.main_image_url} 
                  alt={pkg.title} 
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="ml-4 flex-grow">
                  <h4 className="text-sm font-medium text-gray-900">{pkg.title}</h4>
                  <p className="text-sm text-gray-500">₹{pkg.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Manage Destinations Component
const ManageDestinations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<any>(null);
  const { destinations, loading, error, addDestination, updateDestination, deleteDestination } = useDestinations();
  
  const filteredDestinations = searchQuery 
    ? destinations.filter(dest => 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : destinations;

  const handleSave = async (destinationData: any) => {
    try {
      if (editingDestination) {
        await updateDestination(editingDestination.id, destinationData);
      } else {
        await addDestination(destinationData);
      }
      setShowAddModal(false);
      setEditingDestination(null);
    } catch (error) {
      console.error('Error saving destination:', error);
      alert('Failed to save destination');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await deleteDestination(id);
      } catch (error) {
        console.error('Error deleting destination:', error);
        alert('Failed to delete destination');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
    
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Destinations</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          Add Destination
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 w-full"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500">
                <option value="">All Categories</option>
                <option value="Beaches">Beaches</option>
                <option value="Mountains">Mountains</option>
                <option value="Historical">Historical</option>
                <option value="Nature">Nature</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDestinations.map((destination) => (
                <tr key={destination.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={destination.image_url} 
                          alt={destination.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{destination.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {destination.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setEditingDestination(destination);
                          setShowAddModal(true);
                        }}
                        className="p-1 text-cyan-600 hover:text-cyan-900" 
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(destination.id)}
                        className="p-1 text-red-600 hover:text-red-900" 
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(showAddModal || editingDestination) && (
        <AddEditDestinationModal
          destination={editingDestination}
          onClose={() => {
            setShowAddModal(false);
            setEditingDestination(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// Manage Packages Component
const ManagePackages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const { packages, loading, error, addPackage, updatePackage, deletePackage } = usePackages();
  const { destinations } = useDestinations();

  const handleSave = async (packageData: any) => {
    try {
      if (editingPackage) {
        await updatePackage(editingPackage.id, packageData);
      } else {
        await addPackage(packageData);
      }
      setShowAddModal(false);
      setEditingPackage(null);
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Failed to save package');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id);
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('Failed to delete package');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Packages</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          Add Package
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 w-full"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500">
                <option value="">All Destinations</option>
                {destinations.map(dest => (
                  <option key={dest.id} value={dest.id}>{dest.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={pkg.main_image_url} 
                          alt={pkg.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {destinations.find(d => d.id === pkg.destination_id)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pkg.duration} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{pkg.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setEditingPackage(pkg);
                          setShowAddModal(true);
                        }}
                        className="p-1 text-cyan-600 hover:text-cyan-900" 
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(pkg.id)}
                        className="p-1 text-red-600 hover:text-red-900" 
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(showAddModal || editingPackage) && (
        <AddEditPackageModal
          package={editingPackage}
          destinationId={editingPackage?.destination_id || destinations[0]?.id}
          onClose={() => {
            setShowAddModal(false);
            setEditingPackage(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// Manage Guides Component
const ManageGuides: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState<any>(null);
  const { guides, loading, error, addGuide, updateGuide, deleteGuide } = useGuides();
  const { destinations } = useDestinations();

  const handleSave = async (guideData: any) => {
    try {
      if (editingGuide) {
        await updateGuide(editingGuide.id, guideData);
      } else {
        await addGuide(guideData);
      }
      setShowAddModal(false);
      setEditingGuide(null);
    } catch (error) {
      console.error('Error saving guide:', error);
      alert('Failed to save guide');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this guide?')) {
      try {
        await deleteGuide(id);
      } catch (error) {
        console.error('Error deleting guide:', error);
        alert('Failed to delete guide');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Guides</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          Add Guide
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 w-full"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2">
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-cyan-500 focus:border-cyan-500">
                <option value="">All Destinations</option>
                {destinations.map(dest => (
                  <option key={dest.id} value={dest.id}>{dest.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guide</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guides.map((guide) => (
                <tr key={guide.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={guide.image_url} 
                          alt={guide.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{guide.name}</div>
                        <div className="text-sm text-gray-500">{guide.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {destinations.find(d => d.id === guide.destination_id)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {guide.experience_years} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {guide.languages.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{guide.price_per_day.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setEditingGuide(guide);
                          setShowAddModal(true);
                        }}
                        className="p-1 text-cyan-600 hover:text-cyan-900" 
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(guide.id)}
                        className="p-1 text-red-600 hover:text-red-900" 
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(showAddModal || editingGuide) && (
        <AddEditGuideModal
          guide={editingGuide}
          destinationId={editingGuide?.destination_id || destinations[0]?.id}
          onClose={() => {
            setShowAddModal(false);
            setEditingGuide(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// Calendar Icon Component
const Calendar: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
};

// Admin Sidebar Component
const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === '/admin' && currentPath === '/admin') {
      return true;
    }
    if (path !== '/admin' && currentPath.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center space-x-2 mb-6 p-2">
        <MapPin className="h-6 w-6 text-cyan-600" />
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="space-y-1">
        <Link 
          to="/admin"
          className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
            isActive('/admin') 
              ? 'bg-cyan-50 text-cyan-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <BarChart2 className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
        
        <Link 
          to="/admin/destinations"
          className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
            isActive('/admin/destinations') 
              ? 'bg-cyan-50 text-cyan-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Map className="h-5 w-5 mr-3" />
          Destinations
        </Link>
        
        <Link 
          to="/admin/packages"
          className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
            isActive('/admin/packages') 
              ? 'bg-cyan-50 text-cyan-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Package className="h-5 w-5 mr-3" />
          Packages
        </Link>
        
        <Link 
          to="/admin/guides"
          className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
            isActive('/admin/guides') 
              ? 'bg-cyan-50 text-cyan-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <User className="h-5 w-5 mr-3" />
          Guides
        </Link>
        
        <Link 
          to="/admin/users"
          className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
            isActive('/admin/users') 
              ? 'bg-cyan-50 text-cyan-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users className="h-5 w-5 mr-3" />
          Users
        </Link>
      </nav>
      
      <div className="border-t border-gray-200 mt-6 pt-4">
        <Link 
          to="/"
          className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <Home className="h-5 w-5 mr-3" />
          Back to Site
        </Link>
        
        <button 
          className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

// Main Admin Page Component
const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user || !user.isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <AdminSidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-grow">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="destinations" element={<ManageDestinations />} />
              <Route path="packages" element={<ManagePackages />} />
              <Route path="guides" element={<ManageGuides />} />
              <Route path="users" element={<div>Manage Users</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;