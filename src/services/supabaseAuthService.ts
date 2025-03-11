// Supabase authentication service using MCP server

// User interface
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Session interface
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Store the current user in localStorage for persistence
const CURRENT_USER_KEY = 'seoCurrentUser';
const SESSION_KEY = 'seoUserSession';

// Register a new user
export const registerUser = async (email: string, password: string, name?: string): Promise<User | null> => {
  try {
    if (isMcpAvailable()) {
      // Call the Supabase MCP server to register the user
      const response = await window.mcpTools["github.com/alexander-zuev/supabase-mcp-server"].signUp({
        email,
        password,
        name
      });
      
      const result = JSON.parse(response);
      
      if (result.user) {
        // Return the user object
        return result.user;
      }
    } else {
      // Mock implementation using localStorage
      console.log('MCP tools not available, using mock implementation');
      const user = {
        id: `user-${Date.now()}`,
        email,
        name: name || '',
      };
      
      // Store the user in localStorage
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  }
};

// Login a user
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    if (isMcpAvailable()) {
      // Call the Supabase MCP server to sign in the user
      const response = await window.mcpTools["github.com/alexander-zuev/supabase-mcp-server"].signIn({
        email,
        password
      });
      
      const result = JSON.parse(response);
      
      if (result.user && result.session) {
        // Store the user and session in localStorage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user));
        localStorage.setItem(SESSION_KEY, JSON.stringify(result.session));
        
        // Return the user object
        return result.user;
      }
    } else {
      // Mock implementation using localStorage
      console.log('MCP tools not available, using mock implementation');
      
      // For demo purposes, accept any login with email
      const user = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
      };
      
      // Create a mock session
      const session = {
        access_token: `token-${Date.now()}`,
        refresh_token: `refresh-${Date.now()}`,
        expires_at: Date.now() + 3600000, // 1 hour
      };
      
      // Store the user and session in localStorage
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Error logging in user:', error);
    return null;
  }
};

// Get the current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUser) {
    return null;
  }

  try {
    return JSON.parse(currentUser);
  } catch (error) {
    console.error('Error parsing current user from localStorage:', error);
    return null;
  }
};

// Get the current session from localStorage
export const getCurrentSession = (): Session | null => {
  if (typeof window === 'undefined') return null;
  
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session);
  } catch (error) {
    console.error('Error parsing session from localStorage:', error);
    return null;
  }
};

// Set the current user in localStorage
export const setCurrentUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
};

// Logout the current user
export const logoutUser = async (): Promise<void> => {
  try {
    if (isMcpAvailable()) {
      // Call the Supabase MCP server to sign out the user
      await window.mcpTools["github.com/alexander-zuev/supabase-mcp-server"].signOut({});
    } else {
      console.log('MCP tools not available, using mock implementation');
    }
    
    // Always remove the user and session from localStorage
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error logging out user:', error);
    // Still remove the user and session from localStorage
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<boolean> => {
  try {
    if (isMcpAvailable()) {
      // Call the Supabase MCP server to reset the password
      const response = await window.mcpTools["github.com/alexander-zuev/supabase-mcp-server"].resetPassword({
        email
      });
      
      const result = JSON.parse(response);
      
      return result.message === 'Password reset email sent successfully';
    } else {
      // Mock implementation
      console.log('MCP tools not available, using mock implementation');
      console.log(`Password reset email would be sent to ${email}`);
      return true;
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
};

// Check if MCP tools are available
const isMcpAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         window.mcpTools !== undefined && 
         window.mcpTools["github.com/alexander-zuev/supabase-mcp-server"] !== undefined;
};

// Initialize the auth service
export const initAuthService = async (): Promise<void> => {
  try {
    if (isMcpAvailable()) {
      // Check if the user is already logged in with Supabase
      const response = await window.mcpTools["github.com/alexander-zuev/supabase-mcp-server"].getUser({});
      const result = JSON.parse(response);
      
      if (result.user) {
        // Update the user in localStorage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(result.user));
      } else {
        // Clear the user from localStorage if not logged in with Supabase
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(SESSION_KEY);
      }
    } else {
      console.log('MCP tools not available, using localStorage only');
      // Just use the current user from localStorage
    }
  } catch (error) {
    console.error('Error initializing auth service:', error);
  }
};

// Declare the MCP tools interface for TypeScript
declare global {
  interface Window {
    mcpTools: {
      "github.com/alexander-zuev/supabase-mcp-server": {
        signUp: (args: { email: string; password: string; name?: string }) => Promise<string>;
        signIn: (args: { email: string; password: string }) => Promise<string>;
        signOut: (args: {}) => Promise<string>;
        getUser: (args: {}) => Promise<string>;
        resetPassword: (args: { email: string }) => Promise<string>;
      };
    };
  }
}
