import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  date: string; // ISO string
  note?: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

interface TransactionsState {
  transactions: Transaction[];
  isHydrated: boolean;
  hydrate: (userId: string) => Promise<void>;
  addTransaction: (userId: string, transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  clear: () => void;
}

const getStorageKey = (userId: string) => `spendly-transactions-${userId}`;

const loadTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    const key = getStorageKey(userId);
    const data = await SecureStore.getItemAsync(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load transactions:', error);
    return [];
  }
};

const saveTransactions = async (userId: string, transactions: Transaction[]): Promise<void> => {
  try {
    const key = getStorageKey(userId);
    await SecureStore.setItemAsync(key, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions:', error);
    throw error;
  }
};

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  isHydrated: false,

  hydrate: async (userId: string) => {
    const transactions = await loadTransactions(userId);
    set({ transactions, isHydrated: true });
  },

  addTransaction: async (userId: string, transactionData: Omit<Transaction, 'id' | 'userId'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      userId,
    };

    const currentTransactions = get().transactions;
    const updatedTransactions = [...currentTransactions, newTransaction];

    await saveTransactions(userId, updatedTransactions);
    set({ transactions: updatedTransactions });
  },

  clear: () => {
    set({ transactions: [], isHydrated: false });
  },
}));

// Helper functions for date/time calculations and summaries

export interface DateRange {
  start: Date;
  end: Date;
}

export function getCalendarMonthRange(now: Date = new Date()): DateRange {
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export function getWeekRange(now: Date = new Date()): DateRange {
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function isDateInRange(dateString: string, range: DateRange): boolean {
  const date = new Date(dateString);
  return date >= range.start && date <= range.end;
}

export function sumIncomeForRange(transactions: Transaction[], range: DateRange): number {
  return transactions
    .filter(t => t.type === 'income' && isDateInRange(t.date, range))
    .reduce((sum, t) => sum + t.amount, 0);
}

export function sumExpensesForRange(transactions: Transaction[], range: DateRange): number {
  return transactions
    .filter(t => t.type === 'expense' && isDateInRange(t.date, range))
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getRemainingBalance(transactions: Transaction[], range: DateRange): number {
  const income = sumIncomeForRange(transactions, range);
  const expenses = sumExpensesForRange(transactions, range);
  return income - expenses;
}

export function getTransactionsForRange(
  transactions: Transaction[],
  range: DateRange,
  type?: 'income' | 'expense'
): Transaction[] {
  let filtered = transactions.filter(t => isDateInRange(t.date, range));
  
  if (type) {
    filtered = filtered.filter(t => t.type === type);
  }
  
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
