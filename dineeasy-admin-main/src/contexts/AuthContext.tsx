import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Restaurant } from '@/data/mockData';
import * as api from '@/lib/api-client';

interface AuthContextType {
  restaurant: Restaurant | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, cuisineType: string) => Promise<void>;
  logout: () => void;
  updateRestaurant: (updates: Partial<Restaurant>) => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeRestaurant = (data: any): Restaurant | null => {
    if (!data) return null;
    const id = data.id || data._id;
    if (!id) return null;

    return {
      id,
      name: data.name || data.title || 'Restaurant',
      logo: data.logo || '',
      image: data.image || data.logo || '',
      address: data.address || data.location || '',
      phone: data.phone || data.contactPhone || '',
      email: data.email || data.contactEmail || '',
      isOpen: data.isOpen ?? true,
    };
  };

  // Load persisted auth safely on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth_restaurant');
    const token = localStorage.getItem('auth_token');

    if (stored && stored !== 'undefined' && stored !== 'null' && token) {
      try {
        const parsed = JSON.parse(stored);
        const normalized = normalizeRestaurant(parsed);
        if (normalized) {
          setRestaurant(normalized);
        } else {
          // Bad shape, clear it to avoid infinite errors
          localStorage.removeItem('auth_restaurant');
          localStorage.removeItem('auth_token');
        }
      } catch (err) {
        console.error('Failed to parse stored restaurant:', err);
        localStorage.removeItem('auth_restaurant');
        localStorage.removeItem('auth_token');
      }
    } else {
      // Clear leftover invalid values (e.g., "undefined")
      localStorage.removeItem('auth_restaurant');
      if (!stored || stored === 'undefined' || stored === 'null') {
        localStorage.removeItem('auth_token');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.loginRestaurant(email, password);
      if (!response?.restaurant || !response?.token) {
        throw new Error('Invalid login response');
      }
      const normalized = normalizeRestaurant(response.restaurant);
      if (!normalized) throw new Error('Missing restaurant data');
      setRestaurant(normalized);
      localStorage.setItem('auth_restaurant', JSON.stringify(normalized));
      localStorage.setItem('auth_token', response.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, cuisineType: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.registerRestaurant({
        name,
        email,
        password,
        cuisineType,
        isOpen: true,
        address: '',
        phone: '',
        rating: 0,
      });
      if (!response?.restaurant || !response?.token) {
        throw new Error('Invalid registration response');
      }
      const normalized = normalizeRestaurant(response.restaurant);
      if (!normalized) throw new Error('Missing restaurant data');
      setRestaurant(normalized);
      localStorage.setItem('auth_restaurant', JSON.stringify(normalized));
      localStorage.setItem('auth_token', response.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setRestaurant(null);
    localStorage.removeItem('auth_restaurant');
    localStorage.removeItem('auth_token');
  };

  const updateRestaurant = (updates: Partial<Restaurant>) => {
    if (!restaurant) return;
    const updated = { ...restaurant, ...updates };
    setRestaurant(updated);
    localStorage.setItem('auth_restaurant', JSON.stringify(updated));
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      restaurant, 
      isAuthenticated: !!restaurant, 
      login, 
      register,
      logout,       updateRestaurant,      isLoading,
      error,
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
