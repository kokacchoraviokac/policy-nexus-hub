
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';

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
  hasPrivilegeWithContext: () => false,
  hasRole: () => false,
  initiatePasswordReset: async () => false,
  updatePassword: async () => false,
  refreshSession: async () => {},
  customPrivileges: [],
});

// Create a hook for using the auth context
export const useAuth = () => useContext(AuthContext);
