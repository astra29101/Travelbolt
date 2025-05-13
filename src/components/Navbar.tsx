import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, MapPin, Calendar, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || location.pathname !== '/' 
          ? 'bg-white text-gray-800 shadow-md' 
          : 'bg-transparent text-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-cyan-600" />
            <span className="text-xl font-bold">TravelQuest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`hover:text-cyan-500 transition-colors ${
                location.pathname === '/' ? 'text-cyan-500 font-medium' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/destinations" 
              className={`hover:text-cyan-500 transition-colors ${
                location.pathname.includes('/destinations') ? 'text-cyan-500 font-medium' : ''
              }`}
            >
              Destinations
            </Link>
            {user && (
              <Link 
                to="/bookings" 
                className={`hover:text-cyan-500 transition-colors ${
                  location.pathname.includes('/bookings') ? 'text-cyan-500 font-medium' : ''
                }`}
              >
                My Bookings
              </Link>
            )}
          </nav>

          {/* Search and Auth on Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`py-2 pl-10 pr-4 rounded-full text-sm focus:outline-none ${
                  scrolled || location.pathname !== '/' 
                    ? 'bg-gray-100 text-gray-800 focus:ring-2 focus:ring-cyan-300' 
                    : 'bg-white/20 text-white backdrop-blur-sm focus:bg-white/30'
                }`}
              />
              <Search className={`absolute left-3 top-2.5 h-4 w-4 ${
                scrolled || location.pathname !== '/' ? 'text-gray-500' : 'text-white'
              }`} />
            </form>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:text-cyan-500 transition-colors">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link to="/bookings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Calendar className="h-4 w-4 mr-2" />
                      My Bookings
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Home className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="font-medium hover:text-cyan-500 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    scrolled || location.pathname !== '/' 
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                      : 'bg-white text-cyan-700 hover:bg-gray-100'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden focus:outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden ${
          isOpen ? 'block' : 'hidden'
        } bg-white text-gray-800 shadow-lg absolute w-full`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </form>
          
          <Link 
            to="/" 
            className="block py-2 hover:text-cyan-500"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/destinations" 
            className="block py-2 hover:text-cyan-500"
            onClick={() => setIsOpen(false)}
          >
            Destinations
          </Link>
          {user && (
            <Link 
              to="/bookings" 
              className="block py-2 hover:text-cyan-500"
              onClick={() => setIsOpen(false)}
            >
              My Bookings
            </Link>
          )}
          
          <div className="pt-2 mt-2 border-t border-gray-200">
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block py-2 hover:text-cyan-500"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block py-2 hover:text-cyan-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/login" 
                  className="block py-2 text-center hover:text-cyan-500"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block py-2 text-center bg-cyan-600 text-white rounded-full hover:bg-cyan-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;