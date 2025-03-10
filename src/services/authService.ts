// Authentication service for managing user authentication

// User interface
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Simple in-memory user storage (in a real app, this would be a database)
const users: Record<string, { email: string; password: string; name?: string }> = {};

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Register a new user
export const registerUser = (email: string, password: string, name?: string): User | null => {
  // Check if user already exists
  const existingUser = Object.values(users).find(user => user.email === email);
  if (existingUser) {
    return null; // User already exists
  }

  // Create a new user
  const userId = generateId();
  users[userId] = { email, password, name };

  // Store in localStorage for persistence
  localStorage.setItem('seoUsers', JSON.stringify(users));

  // Return the user object (without password)
  return { id: userId, email, name };
};

// Login a user
export const loginUser = (email: string, password: string): User | null => {
  // Load users from localStorage
  const storedUsers = localStorage.getItem('seoUsers');
  if (storedUsers) {
    try {
      Object.assign(users, JSON.parse(storedUsers));
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
    }
  }

  // Find the user
  const userId = Object.keys(users).find(id => users[id].email === email && users[id].password === password);
  if (!userId) {
    return null; // User not found or password incorrect
  }

  // Return the user object (without password)
  const { name } = users[userId];
  return { id: userId, email, name };
};

// Get the current user from localStorage
export const getCurrentUser = (): User | null => {
  const currentUser = localStorage.getItem('seoCurrentUser');
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

// Set the current user in localStorage
export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem('seoCurrentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('seoCurrentUser');
  }
};

// Logout the current user
export const logoutUser = (): void => {
  localStorage.removeItem('seoCurrentUser');
};

// Initialize the auth service
export const initAuthService = (): void => {
  // Load users from localStorage
  const storedUsers = localStorage.getItem('seoUsers');
  if (storedUsers) {
    try {
      Object.assign(users, JSON.parse(storedUsers));
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
    }
  }
};
