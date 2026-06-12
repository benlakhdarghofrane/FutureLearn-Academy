import { create } from 'zustand';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('fl_user') || 'null')
    : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('fl_token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('fl_token') : false,

  login: (token, user) => {
    localStorage.setItem('fl_token', token);
    localStorage.setItem('fl_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('fl_token');
    localStorage.removeItem('fl_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    localStorage.setItem('fl_user', JSON.stringify(user));
    set({ user });
  },
}));
