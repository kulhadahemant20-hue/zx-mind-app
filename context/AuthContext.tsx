import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  plan: 'free' | 'basic' | 'pro';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const USER_KEY = '@zxmind:user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(USER_KEY)
      .then(stored => {
        if (stored) setUser(JSON.parse(stored));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function save(u: User) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  }

  async function signIn(email: string, password: string) {
    if (!email.trim() || !password.trim()) throw new Error('Email aur password daalein');
    if (!email.includes('@')) throw new Error('Valid email daalein');
    if (password.length < 6) throw new Error('Password kam se kam 6 characters ka hona chahiye');
    const u: User = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase().trim(),
      name: email.split('@')[0],
      isPremium: false,
      plan: 'free',
    };
    await save(u);
  }

  async function signUp(email: string, password: string, name: string) {
    if (!email.trim() || !password.trim() || !name.trim()) throw new Error('Sab fields bharna zaroori hai');
    if (!email.includes('@')) throw new Error('Valid email daalein');
    if (password.length < 6) throw new Error('Password kam se kam 6 characters ka hona chahiye');
    const u: User = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      isPremium: false,
      plan: 'free',
    };
    await save(u);
  }

  async function signOut() {
    await AsyncStorage.removeItem(USER_KEY);
    setUser(null);
  }

  async function forgotPassword(_email: string) {
    await new Promise(r => setTimeout(r, 1500));
  }

  async function updateUser(updates: Partial<User>) {
    if (!user) return;
    await save({ ...user, ...updates });
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, forgotPassword, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
