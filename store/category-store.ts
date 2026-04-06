import { create } from 'zustand';
import { Ionicons } from '@expo/vector-icons';

export type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  isCustom: boolean;
  type: 'income' | 'expense';
};

interface CategoryState {
  selectedCategory: Category | null;
  transactionType: 'income' | 'expense';
  setSelectedCategory: (category: Category | null) => void;
  setTransactionType: (type: 'income' | 'expense') => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: null,
  transactionType: 'expense',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setTransactionType: (type) => set({ transactionType: type }),
}));