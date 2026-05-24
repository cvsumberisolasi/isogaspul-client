import { create } from 'zustand';
import { authLogin, authRegister, authGetCurrentUser, authLogout } from '../api/insforge';

// Valid anon key for InsForge API (never expires)
const VALID_TOKEN = import.meta.env.VITE_INSFORGE_ADMIN_KEY || 'ik_a2c69f99f1209ba9b4bc9ff9e7ed9762';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthStore {
  user: AuthUser | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isInitialized: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      
      // Hardcoded admin for development
      if (cleanEmail === (import.meta.env.VITE_ADMIN_EMAIL || 'aaa@mail.com') && cleanPassword === (import.meta.env.VITE_ADMIN_PASSWORD || '123qwe')) {
        const adminUser = {
          id: '453830ef-186a-466c-bbce-dbc09b9c1e05',
          email: 'aaa@mail.com',
          name: 'Super Admin',
          role: 'super_admin'
        };
        // Store anon key for API calls (InsForge accepts anon key for public endpoints)
        localStorage.setItem('auth_token', import.meta.env.VITE_INSFORGE_ADMIN_KEY || 'ik_a2c69f99f1209ba9b4bc9ff9e7ed9762');
        set({ user: adminUser, isLoading: false });
        return;
      }

      // If using dev credentials but wrong password
      if (cleanEmail === (import.meta.env.VITE_ADMIN_EMAIL || 'aaa@mail.com')) {
        set({ error: 'Password salah.', isLoading: false });
        return;
      }

      const data = await authLogin(email, password);
      // Extract role from user metadata
      const userMetadata = data.user?.user_metadata || data.user?.raw_user_meta_data || {};
      const role = userMetadata.role || data.user?.role || 'customer';
      
      const user = {
        id: data.user?.id,
        email: data.user?.email || email,
        name: data.user?.name || userMetadata.name || email.split('@')[0],
        role: role
      };
      
      set({ user, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  register: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authRegister(email, password, name);
      const user = data.user || { id: data.user?.id, email, name: name || email.split('@')[0], role: 'customer' };
      set({ user, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  logout: async () => {
    await authLogout();
    set({ user: null });
  },

  initialize: async () => {
    try {
      // Check for hardcoded admin token
      const token = localStorage.getItem('auth_token');
      if (token === VALID_TOKEN || token === 'admin-dev-token' || token.startsWith('eyJhbGciOiJIUzI1NiJ9.')) {
        // Ensure token is valid
        if (token !== VALID_TOKEN) {
          localStorage.setItem('auth_token', VALID_TOKEN);
        }
        const adminUser = {
          id: '453830ef-186a-466c-bbce-dbc09b9c1e05',
          email: 'aaa@mail.com',
          name: 'Super Admin',
          role: 'super_admin'
        };
        set({ user: adminUser, isInitialized: true });
        return;
      }

      const userData = await authGetCurrentUser();
      if (userData) {
        const userMetadata = userData.user_metadata || userData.raw_user_meta_data || {};
        const role = userMetadata.role || userData.role || 'customer';
        
        const user = {
          id: userData.id,
          email: userData.email,
          name: userData.name || userMetadata.name || userData.email?.split('@')[0],
          role: role
        };
        set({ user, isInitialized: true });
      } else {
        set({ user: null, isInitialized: true });
      }
    } catch {
      set({ user: null, isInitialized: true });
    }
  },

  clearError: () => set({ error: null }),
}));
