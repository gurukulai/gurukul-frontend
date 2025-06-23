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

  // Debug logging for user state changes
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  useEffect(() => {
    // Check for existing session and handle OAuth callback
    checkAuthStatus();
    handleOAuthCallback();
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

  const handleOAuthCallback = async () => {
    // Check if we're returning from OAuth (URL contains authorization code)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code) {
      try {
        setIsLoading(true);
        
        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}auth/google/code`;
        
        // Send the authorization code to backend
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('user login data', data);
        
        if (data) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            picture: data.user.picture,
            createdAt: new Date(data.user.createdAt),
            lastActive: new Date(data.user.lastActive)
          };
          
          setUser(userData);
          localStorage.setItem('gurukul-user', JSON.stringify(userData));
          localStorage.setItem('authToken', data.token);
          
          // Clean up URL by removing the code parameter
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          throw new Error(data.error || 'Authentication failed');
        }
      } catch (error) {
        console.error('OAuth callback failed:', error);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      console.log('Starting Google OAuth 2.0 login process...');
      
      // Get configuration from environment variables
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin;
      
      if (!clientId || clientId === 'your-google-client-id') {
        console.log('Google Client ID not configured, using demo login');
        await demoLogin();
        return;
      }
      
      // Construct Google OAuth URL
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent('openid email profile')}`;
      
      console.log('Redirecting to Google OAuth:', googleAuthUrl);
      
      // Redirect to Google OAuth
      window.location.href = googleAuthUrl;
      
    } catch (error) {
      console.error('Login failed:', error);
      // Fallback to demo login if OAuth fails
      await demoLogin();
    } finally {
      setIsLoading(false);
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
