
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType } from '@/lib/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem('gurukul-user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      
      // Check if Google API is loaded
      if (typeof window.google === 'undefined') {
        // Load Google Identity Services
        await loadGoogleScript();
      }
      
      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
        callback: handleGoogleResponse,
      });

      // Prompt the user to sign in
      window.google.accounts.id.prompt();
      
    } catch (error) {
      console.error('Login failed:', error);
      // Fallback to demo login if Google login fails
      await demoLogin();
    } finally {
      setIsLoading(false);
    }
  };

  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google script'));
      document.head.appendChild(script);
    });
  };

  const handleGoogleResponse = async (response: any) => {
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userData: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        createdAt: new Date(),
        lastActive: new Date()
      };
      
      setUser(userData);
      localStorage.setItem('gurukul-user', JSON.stringify(userData));
      
    } catch (error) {
      console.error('Google login failed:', error);
      // Fallback to demo login
      await demoLogin();
    }
  };

  const demoLogin = async () => {
    // Demo login for development
    const userData: User = {
      id: 'demo-user-' + Date.now(),
      email: 'demo@gurukul.ai',
      name: 'Demo User',
      picture: 'https://via.placeholder.com/40',
      createdAt: new Date(),
      lastActive: new Date()
    };
    
    setUser(userData);
    localStorage.setItem('gurukul-user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Sign out from Google if available
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
      }
      
      setUser(null);
      localStorage.removeItem('gurukul-user');
      
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Extend window interface for Google API
declare global {
  interface Window {
    google: any;
  }
}
