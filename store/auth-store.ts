import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  signup: (name: string, email: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ 
          user: { id: '1', name: 'User', email }, 
          isAuthenticated: true 
        });
      },
      signup: async (name, email) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ 
          user: { id: '1', name, email }, 
          isAuthenticated: true 
        });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'spendly-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
