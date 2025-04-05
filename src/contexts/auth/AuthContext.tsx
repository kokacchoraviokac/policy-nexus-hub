
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth/contextTypes';

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
  customPrivileges: [],
  signIn: async () => ({ error: new Error('Not implemented') }),
  signUp: async () => {},
  signOut: async () => {},
  login: async () => ({ error: new Error('Not implemented') }),
  logout: async () => {},
  updateUser: async () => {},
  updateUserProfile: async () => {},
  initiatePasswordReset: async () => ({ error: new Error('Not implemented') }),
  updatePassword: async () => ({ error: new Error('Not implemented') }),
  hasPrivilege: () => false,
  hasRole: () => false,
  hasPrivilegeWithContext: () => false,
  refreshSession: async () => {},
});

// Create a hook for using the auth context
export const useAuth = () => useContext(AuthContext);
