import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: Location;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center">
              <MapPin className="h-8 w-8 text-cyan-600" />
              <span className="text-2xl font-bold ml-2">TravelQuest</span>
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-800">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="mb-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-cyan-600 hover:bg-cyan-700'
                  }`}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>Demo accounts:</p>
                <div className="mt-1 mb-4 text-xs bg-gray-50 p-2 rounded-lg">
                  <p><strong>Admin:</strong> admin@example.com / password</p>
                  <p><strong>User:</strong> user@example.com / password</p>
                </div>
              </div>
            </form>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-cyan-600 font-medium hover:text-cyan-800">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;