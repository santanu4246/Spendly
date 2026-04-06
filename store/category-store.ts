import { create } from 'zustand';
import { Ionicons } from '@expo/vector-icons';

export type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  isCustom: boolean;
};

interface CategoryState {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));