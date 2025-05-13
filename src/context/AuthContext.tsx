import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
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
    checkUser();
  }, []);

  const checkUser = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('users').select('*').maybeSingle();
      if (data) setUser({ ...data, isAdmin: data.is_admin });
    } catch (err) {
      console.error('Error checking user:', err);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, age: number, location: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, password, age, location, is_admin: false }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Signup failed. No user data returned.');

      setUser({ ...data, isAdmin: data.is_admin });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Invalid email or password');

      setUser({ ...data, isAdmin: data.is_admin });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const value = { user, login, signup, logout, loading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};