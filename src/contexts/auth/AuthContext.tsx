
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth/contextTypes';

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  login: async () => ({ error: new Error('Not implemented') }),
  logout: async () => {},
  updateUser: async () => {},
  hasPrivilege: () => false,
  hasPrivilegeWithContext: () => false,
  hasRole: () => false,
  initiatePasswordReset: async () => false,
  updatePassword: async () => false,
  customPrivileges: [],
});

// Create a hook for using the auth context
export const useAuth = () => useContext(AuthContext);
