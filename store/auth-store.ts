import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AccountsStore } from './accounts-store';
import { useTransactionsStore } from './transactions-store';

const AUTH_SESSION_KEY = 'spendly-auth-session';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  loginError: string | null;
  signupError: string | null;
  profileError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearErrors: () => void;
  hydrate: () => Promise<void>;
}

// Validation helpers
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

// Helper to save session to SecureStore
const saveSession = async (user: User) => {
  try {
    await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

// Helper to load session from SecureStore
const loadSession = async (): Promise<User | null> => {
  try {
    const data = await SecureStore.getItemAsync(AUTH_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
};

// Helper to clear session from SecureStore
const clearSession = async () => {
  try {
    await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  loginError: null,
  signupError: null,
  profileError: null,
  
  hydrate: async () => {
    const user = await loadSession();
    set({ 
      user, 
      isAuthenticated: !!user,
      isHydrated: true 
    });
  },
  
  login: async (email, password) => {
    set({ loginError: null });
    
    // Validate inputs
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError) {
      set({ loginError: emailError });
      return false;
    }
    
    if (passwordError) {
      set({ loginError: passwordError });
      return false;
    }
    
    // Validate credentials
    const result = await AccountsStore.validateCredentials(email, password);
    
    if (!result.success) {
      set({ loginError: result.error || 'Login failed' });
      return false;
    }
    
    // Set authenticated user
    const user = { 
      id: result.account!.id, 
      name: result.account!.name, 
      email: result.account!.email 
    };
    
    await saveSession(user);
    
    set({ 
      user, 
      isAuthenticated: true,
      loginError: null
    });
    
    return true;
  },
  
  signup: async (name, email, password) => {
    set({ signupError: null });
    
    // Validate inputs
    if (!name || name.trim().length < 2) {
      set({ signupError: 'Name must be at least 2 characters' });
      return false;
    }
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError) {
      set({ signupError: emailError });
      return false;
    }
    
    if (passwordError) {
      set({ signupError: passwordError });
      return false;
    }
    
    // Register account
    const result = await AccountsStore.registerAccount(name, email, password);
    
    if (!result.success) {
      set({ signupError: result.error || 'Signup failed' });
      return false;
    }
    
    // Set authenticated user
    const user = { 
      id: result.account!.id, 
      name: result.account!.name, 
      email: result.account!.email 
    };
    
    await saveSession(user);
    
    set({ 
      user, 
      isAuthenticated: true,
      signupError: null
    });
    
    return true;
  },

  updateProfile: async (name: string, email: string) => {
    set({ profileError: null });
    const current = get().user;
    if (!current) {
      set({ profileError: 'Not signed in' });
      return false;
    }

    const result = await AccountsStore.updateAccountProfile(current.id, {
      name,
      email,
    });

    if (!result.success || !result.account) {
      set({ profileError: result.error || 'Could not update profile' });
      return false;
    }

    const user: User = {
      id: result.account.id,
      name: result.account.name,
      email: result.account.email,
    };

    await saveSession(user);
    set({ user, profileError: null });
    return true;
  },

  logout: async () => {
    await clearSession();
    useTransactionsStore.getState().clear();
    set({
      user: null,
      isAuthenticated: false,
      loginError: null,
      signupError: null,
      profileError: null,
    });
  },
  
  clearErrors: () => {
    set({ loginError: null, signupError: null, profileError: null });
  },
}));
