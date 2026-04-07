import * as SecureStore from 'expo-secure-store';

const ACCOUNTS_KEY = 'spendly-accounts';

export interface Account {
  id: string;
  email: string;
  password: string;
  name: string;
}

export const AccountsStore = {
  async getAccounts(): Promise<Account[]> {
    try {
      const data = await SecureStore.getItemAsync(ACCOUNTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load accounts:', error);
      return [];
    }
  },

  async saveAccounts(accounts: Account[]): Promise<void> {
    try {
      await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (error) {
      console.error('Failed to save accounts:', error);
    }
  },

  async registerAccount(name: string, email: string, password: string): Promise<{ success: boolean; error?: string; account?: Account }> {
    const accounts = await this.getAccounts();
    
    // Check if email already exists
    const existingAccount = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
    if (existingAccount) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Create new account
    const newAccount: Account = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      password,
      name,
    };

    accounts.push(newAccount);
    await this.saveAccounts(accounts);

    return { success: true, account: newAccount };
  },

  async validateCredentials(email: string, password: string): Promise<{ success: boolean; error?: string; account?: Account }> {
    const accounts = await this.getAccounts();
    
    const account = accounts.find(
      acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    if (!account) {
      return { success: false, error: 'Invalid email or password' };
    }

    return { success: true, account };
  },

  async updateAccountProfile(
    userId: string,
    updates: { name: string; email: string }
  ): Promise<{ success: boolean; error?: string; account?: Account }> {
    const accounts = await this.getAccounts();
    const idx = accounts.findIndex((a) => a.id === userId);
    if (idx === -1) {
      return { success: false, error: 'Account not found' };
    }

    const trimmedName = updates.name.trim();
    if (trimmedName.length < 2) {
      return { success: false, error: 'Display name must be at least 2 characters' };
    }

    const newEmail = updates.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      return { success: false, error: 'Please enter a valid email' };
    }

    if (newEmail !== accounts[idx].email) {
      const taken = accounts.some(
        (a, i) => i !== idx && a.email.toLowerCase() === newEmail
      );
      if (taken) {
        return { success: false, error: 'An account with this email already exists' };
      }
    }

    accounts[idx].name = trimmedName;
    accounts[idx].email = newEmail;
    await this.saveAccounts(accounts);

    return { success: true, account: accounts[idx] };
  },

  async updatePassword(email: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const accounts = await this.getAccounts();
    
    // Find account and verify current password
    const accountIndex = accounts.findIndex(
      acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === currentPassword
    );
    
    if (accountIndex === -1) {
      return { success: false, error: 'Invalid email or current password' };
    }
    
    // Update password
    accounts[accountIndex].password = newPassword;
    await this.saveAccounts(accounts);
    
    return { success: true };
  },
};
