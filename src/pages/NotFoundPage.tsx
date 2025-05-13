import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="text-9xl font-bold text-gray-200">404</div>
                <Search className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-cyan-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/"
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">You might be looking for</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link 
                to="/"
                className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700"
              >
                Home
              </Link>
              <Link 
                to="/destinations"
                className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700"
              >
                Destinations
              </Link>
              <Link 
                to="/login"
                className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;