'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, setCurrentUser, loginUser, registerUser, logoutUser, initAuthService, updateUserProfile } from '@/services/authService';
import { generateDemoProjectWithTasks } from '@/utils/demoData';
import { dataService } from '@/services/dataService';

// Define the context type
interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, name?: string) => Promise<User | null>;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<User, 'id'>>) => Promise<User | null>;
  resetPassword: (email: string) => Promise<boolean>;
}

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: async () => null,
  register: async () => null,
  logout: () => {},
  updateProfile: async () => null,
  resetPassword: async () => false,
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
  
  // Periodically save user data to Supabase
  useEffect(() => {
    if (!user) return;
    
    // Save user data every 5 minutes
    const saveInterval = setInterval(async () => {
      try {
        const projects = dataService.getProjects();
        const tasks = dataService.getTasks();
        
        await fetch('/api/mcp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            server: 'supabase-mcp-server',
            tool: 'saveUserData',
            args: {
              userId: user.id,
              projects: projects,
              tasks: tasks
            }
          }),
        });
        
        console.log('User data auto-saved to Supabase');
      } catch (error) {
        console.error('Error auto-saving user data:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(saveInterval);
  }, [user]);

  // Login function
  const login = async (email: string, password: string): Promise<User | null> => {
    const loggedInUser = loginUser(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      setCurrentUser(loggedInUser);
      
      try {
        // Try to retrieve user data from Supabase
        const response = await fetch('/api/mcp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            server: 'supabase-mcp-server',
            tool: 'getUserData',
            args: {
              userId: loggedInUser.id
            }
          }),
        });
        
        const result = await response.json();
        if (result.success && result.data && result.data.data) {
          // If user data exists, load it
          const userData = result.data.data;
          if (userData.projects && userData.tasks) {
            dataService.saveProjects(userData.projects);
            dataService.saveTasks(userData.tasks);
          }
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    }
    return loggedInUser;
  };

  // Register function
  const register = async (email: string, password: string, name?: string): Promise<User | null> => {
    const newUser = registerUser(email, password, name);
    if (newUser) {
      setUser(newUser);
      setCurrentUser(newUser);
      
      // Initialize empty projects and tasks for the new user
      const emptyProjects: any[] = [];
      const emptyTasks: any[] = [];
      
      try {
        // Save initial empty data to Supabase
        await fetch('/api/mcp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            server: 'supabase-mcp-server',
            tool: 'saveUserData',
            args: {
              userId: newUser.id,
              projects: emptyProjects,
              tasks: emptyTasks
            }
          }),
        });
      } catch (error) {
        console.error('Error saving initial user data:', error);
      }
    }
    return newUser;
  };

  // Logout function
  const logout = async () => {
    if (user) {
      try {
        // Get current projects and tasks
        const projects = dataService.getProjects();
        const tasks = dataService.getTasks();
        
        // Save user data to Supabase before logging out
        await fetch('/api/mcp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            server: 'supabase-mcp-server',
            tool: 'saveUserData',
            args: {
              userId: user.id,
              projects: projects,
              tasks: tasks
            }
          }),
        });
      } catch (error) {
        console.error('Error saving user data before logout:', error);
      }
    }
    
    setUser(null);
    logoutUser();
    
    // Clear existing projects and tasks
    dataService.saveProjects([]);
    dataService.saveTasks([]);
    
    // Generate demo data for the logged-out user
    generateDemoProjectWithTasks();
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

  // Reset password function
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Use the Supabase MCP server to send a password reset email
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server: 'supabase-mcp-server',
          tool: 'resetPassword',
          args: {
            email: email
          }
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        console.log(`Password reset email sent to ${email}`);
        return true;
      } else {
        console.error('Error sending password reset email:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  };

  // Provide the context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
