
import React, { useState } from "react";
import { AuthContextProvider } from "./AuthContext";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { usePrivilegeCheck } from "@/hooks/usePrivilegeCheck";
import { AuthState, CustomPrivilege } from "@/types/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize auth state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });
  
  // Initialize custom privileges
  const [customPrivileges, setCustomPrivileges] = useState<CustomPrivilege[]>([]);

  // Get auth operations
  const { login, logout, signUp, updateUser } = useAuthOperations(authState, setAuthState);

  // Get privilege checking functions
  const { hasPrivilege, hasPrivilegeWithContext } = usePrivilegeCheck(
    authState.user, 
    authState.isAuthenticated,
    customPrivileges
  );

  // Combine all context values
  const contextValue = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout,
    hasPrivilege,
    hasPrivilegeWithContext,
    updateUser,
    signUp,
    // New methods for enhanced user profile
    customPrivileges,
    initiatePasswordReset: async (email: string) => {
      return await import('@/utils/authUtils').then(
        module => module.initiatePasswordReset(email)
      );
    },
    updatePassword: async (newPassword: string) => {
      return await import('@/utils/authUtils').then(
        module => module.updatePassword(newPassword)
      );
    }
  };

  return (
    <AuthContextProvider value={contextValue}>
      {children}
    </AuthContextProvider>
  );
};
