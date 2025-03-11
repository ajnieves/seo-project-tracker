'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, setCurrentUser, loginUser, registerUser, logoutUser, initAuthService, updateUserProfile } from '@/services/authService';

// Define the context type
interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, name?: string) => Promise<User | null>;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<User, 'id'>>) => Promise<User | null>;
}

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: async () => null,
  register: async () => null,
  logout: () => {},
  updateProfile: async () => null,
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize the auth service and load the current user
  useEffect(() => {
    const initAuth = async () => {
      initAuthService();
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User | null> => {
    const loggedInUser = loginUser(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      setCurrentUser(loggedInUser);
    }
    return loggedInUser;
  };

  // Register function
  const register = async (email: string, password: string, name?: string): Promise<User | null> => {
    const newUser = registerUser(email, password, name);
    if (newUser) {
      setUser(newUser);
      setCurrentUser(newUser);
    }
    return newUser;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    logoutUser();
  };

  // Update profile function
  const updateProfile = async (updates: Partial<Omit<User, 'id'>>): Promise<User | null> => {
    if (!user) return null;
    
    const updatedUser = updateUserProfile(user.id, updates);
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  };

  // Provide the context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
