
import React from "react";
import { AuthContextProvider } from "./AuthContext";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { usePrivilegeCheck } from "@/hooks/usePrivilegeCheck";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get auth session state
  const { 
    authState, 
    setAuthState, 
    customPrivileges, 
    setCustomPrivileges 
  } = useAuthSession();

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
    ...authState,
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
