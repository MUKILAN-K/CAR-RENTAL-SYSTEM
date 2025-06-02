import { create } from 'zustand';
import { type Profile } from '../types/mysql';
import api from '../lib/api';

type AuthState = {
  user: any | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  setAdminSession: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAdmin: localStorage.getItem('adminSession') === 'true',
  isLoading: true,
  
  checkAuth: async () => {
    set({ isLoading: true });
    
    // Check for admin session first
    if (localStorage.getItem('adminSession') === 'true') {
      set({ 
        user: { id: 'admin', email: 'admin@carznow.com' },
        profile: { 
          id: 'admin',
          email: 'admin@carznow.com',
          full_name: 'Administrator',
          role: 'admin',
          created_at: new Date().toISOString()
        },
        isAdmin: true,
        isLoading: false
      });
      return;
    }
    
    // For local development, we'll just check localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      
      try {
        const response = await api.get(`/profiles/${user.id}`);
        const profile = response.data;
        
        set({ 
          user, 
          profile,
          isAdmin: profile?.role === 'admin' || false,
          isLoading: false 
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        set({ user: null, profile: null, isAdmin: false, isLoading: false });
      }
    } else {
      set({ user: null, profile: null, isAdmin: false, isLoading: false });
    }
  },
  
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      await get().checkAuth();
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
  
  signup: async (email, password, fullName) => {
    try {
      const userId = crypto.randomUUID();
      const response = await api.post('/auth/signup', {
        id: userId,
        email,
        full_name: fullName,
        role: 'user'
      });
      
      const user = { id: userId, email };
      localStorage.setItem('user', JSON.stringify(user));
      await get().checkAuth();
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
  
  logout: async () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('user');
    set({ user: null, profile: null, isAdmin: false });
  },
  
  setAdminSession: () => {
    localStorage.setItem('adminSession', 'true');
    set({
      user: { id: 'admin', email: 'admin@carznow.com' },
      profile: {
        id: 'admin',
        email: 'admin@carznow.com',
        full_name: 'Administrator',
        role: 'admin',
        created_at: new Date().toISOString()
      },
      isAdmin: true
    });
  }
}));