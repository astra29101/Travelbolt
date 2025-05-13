import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  location?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, age: number, location: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in (from localStorage in this mock version)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock login - in a real app, this would be an API call
      if (email === 'admin@example.com' && password === 'password') {
        const adminUser = {
          id: '123e4567-e89b-12d3-a456-426614174000', // UUID format for admin
          name: 'Admin User',
          email: 'admin@example.com',
          isAdmin: true,
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
      } else if (email === 'user@example.com' && password === 'password') {
        const regularUser = {
          id: '123e4567-e89b-12d3-a456-426614174001', // UUID format for regular user
          name: 'John Doe',
          email: 'user@example.com',
          age: 30,
          location: 'New York',
          isAdmin: false,
        };
        setUser(regularUser);
        localStorage.setItem('user', JSON.stringify(regularUser));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, age: number, location: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock signup - in a real app, this would be an API call
      const newUser = {
        id: crypto.randomUUID(), // Generate a proper UUID for new users
        name,
        email,
        age,
        location,
        isAdmin: false,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};