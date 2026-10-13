import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/initialData';

const AuthContext = createContext(null);

const STORAGE_KEY = 'campus_recovery_current_user';
const USERS_STORAGE_KEY = 'campus_recovery_registered_users';

export const AuthProvider = ({ children }) => {
  // Registered users list in localStorage initialized with DEMO_USERS
  const [usersList, setUsersList] = useState(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  });

  // Current active user (defaults to Student Alex Rivera for immediate prototype exploration)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return DEMO_USERS[0]; // Default: Alex Rivera
    } catch {
      return DEMO_USERS[0];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync auth state to localStorage', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    } catch (e) {
      console.error('Failed to sync users list to localStorage', e);
    }
  }, [usersList]);

  // Demo user quick-switch
  const switchDemoUser = (userId) => {
    const found = usersList.find((u) => u.id === Number(userId));
    if (found) {
      setCurrentUser(found);
      return found;
    }
    return null;
  };

  // Login implementation
  const login = async ({ email, password }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600)); // Realistic network latency

    const cleanEmail = email.trim().toLowerCase();
    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!existing) {
      setIsLoading(false);
      throw new Error(`No account registered with ${cleanEmail}. Please sign up or select a Demo Profile.`);
    }

    // In prototype mode, allow standard demo passwords or any password for newly created test users
    if (password.length < 6) {
      setIsLoading(false);
      throw new Error('Password must be at least 6 characters long.');
    }

    setCurrentUser(existing);
    setIsLoading(false);
    return existing;
  };

  // Register implementation
  const register = async ({ name, email, phone, password, confirmPassword }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 750));

    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate
    if (usersList.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setIsLoading(false);
      throw new Error(`An account with email ${cleanEmail} already exists. Please log in instead.`);
    }

    // Format new user
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      role: cleanEmail.includes('admin') || cleanEmail.includes('security') ? 'ADMIN' : 'USER',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      studentId: `ST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      department: 'Campus Student Member'
    };

    setUsersList((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsLoading(false);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (data) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsersList((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'ADMIN',
    isLoading,
    usersList,
    login,
    register,
    logout,
    updateProfile,
    switchDemoUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
