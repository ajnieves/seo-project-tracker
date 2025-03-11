'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  getCurrentUser, 
  loginUser, 
  logoutUser, 
  registerUser, 
  setCurrentUser,
  initAuthService,
  resetPassword
} from '@/services/supabaseAuthService';

// Context interface
interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<User | null>;
  resetPassword: (email: string) => Promise<boolean>;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: async () => null,
  logout: async () => {},
  register: async () => null,
  resetPassword: async () => false,
});

// Hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize the user from localStorage on mount
  useEffect(() => {
    const initUser = async () => {
      try {
        // Initialize the auth service
        await initAuthService();
        
        // Get the current user
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const user = await loginUser(email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Register function
  const register = async (email: string, password: string, name?: string): Promise<User | null> => {
    try {
      const user = await registerUser(email, password, name);
      if (user) {
        // Auto-login after registration
        setUser(user);
        setCurrentUser(user);
      }
      return user;
    } catch (error) {
      console.error('Error registering:', error);
      return null;
    }
  };

  // Reset password function
  const resetPasswordFn = async (email: string): Promise<boolean> => {
    try {
      return await resetPassword(email);
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout,
    register,
    resetPassword: resetPasswordFn,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
