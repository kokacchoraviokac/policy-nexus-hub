
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';
import { UserRole } from '@/types/auth/userTypes';
import { ResourceContext } from '@/types/auth/contextTypes';

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userProfile: null,
  role: null,
  companyId: null,
  isInitialized: false,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  login: async () => ({ error: undefined }),
  logout: async () => {},
  updateUser: async () => {},
  updateUserProfile: async () => {},
  hasPrivilege: () => false,
  hasPrivilegeWithContext: (privilege: string, context?: ResourceContext) => false,
  hasRole: (role: UserRole | UserRole[]) => false,
  initiatePasswordReset: async () => false,
  updatePassword: async () => false,
  refreshSession: async () => {},
  customPrivileges: [],
});

// Create a hook for using the auth context
export const useAuth = () => useContext(AuthContext);
