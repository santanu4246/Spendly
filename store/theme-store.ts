import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTheme = 'light' | 'dark';

interface ThemeState {
  themeMode: ThemeMode;
  activeTheme: ActiveTheme;
  isHydrated: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  hydrate: () => Promise<void>;
  updateSystemTheme: () => void;
}

const THEME_KEY = 'spendly-theme-mode';

const getSystemTheme = (): ActiveTheme => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
};

const resolveActiveTheme = (mode: ThemeMode): ActiveTheme => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: 'dark',
  activeTheme: 'dark',
  isHydrated: false,

  hydrate: async () => {
    try {
      const stored = await SecureStore.getItemAsync(THEME_KEY);
      const mode = (stored as ThemeMode) || 'dark';
      const activeTheme = resolveActiveTheme(mode);
      set({ themeMode: mode, activeTheme, isHydrated: true });
    } catch (error) {
      console.error('Failed to load theme:', error);
      set({ themeMode: 'dark', activeTheme: 'dark', isHydrated: true });
    }
  },

  setThemeMode: async (mode: ThemeMode) => {
    try {
      await SecureStore.setItemAsync(THEME_KEY, mode);
      const activeTheme = resolveActiveTheme(mode);
      set({ themeMode: mode, activeTheme });
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  },

  updateSystemTheme: () => {
    const { themeMode } = get();
    if (themeMode === 'system') {
      const activeTheme = getSystemTheme();
      set({ activeTheme });
    }
  },
}));
