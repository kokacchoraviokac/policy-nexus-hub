
import React, { createContext, useContext } from 'react';
import { User, UserRole } from '@/types/auth/user';
import { Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  userProfile: any | null; // The user profile from the database
  role: UserRole | null;
  companyId: string | null;
  permissions: string[];
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  initiatePasswordReset: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  hasPrivilege: (privilege: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  refreshSession: () => Promise<void>;
}

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  userProfile: null,
  role: null,
  companyId: null,
  permissions: [],
  signIn: async () => ({ error: new Error('Not implemented') }),
  signUp: async () => {},
  signOut: async () => {},
  updateUser: async () => {},
  initiatePasswordReset: async () => ({ error: new Error('Not implemented') }),
  updatePassword: async () => ({ error: new Error('Not implemented') }),
  hasPrivilege: () => false,
  hasRole: () => false,
  refreshSession: async () => {},
});

// Create a hook for using the auth context
export const useAuth = () => useContext(AuthContext);
