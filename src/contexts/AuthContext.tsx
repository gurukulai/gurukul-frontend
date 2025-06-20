
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
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/me');
      // if (response.ok) {
      //   const userData = await response.json();
      //   setUser(userData);
      // }
      
      // Mock auth check for demo
      const storedUser = localStorage.getItem('gurukul-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
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
      
      // TODO: Implement Google OAuth
      // const response = await signInWithPopup(auth, googleProvider);
      // const userData = {
      //   id: response.user.uid,
      //   email: response.user.email!,
      //   name: response.user.displayName!,
      //   picture: response.user.photoURL,
      //   createdAt: new Date(),
      //   lastActive: new Date()
      // };
      
      // Mock login for demo
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
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Implement actual logout
      // await signOut(auth);
      
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
