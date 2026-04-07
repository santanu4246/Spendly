import { useThemeStore } from '@/store/theme-store';
import { DarkColors, LightColors } from '@/constants/colors';

export function useThemeColor() {
  const activeTheme = useThemeStore((state) => state.activeTheme);
  return activeTheme === 'dark' ? DarkColors : LightColors;
}
