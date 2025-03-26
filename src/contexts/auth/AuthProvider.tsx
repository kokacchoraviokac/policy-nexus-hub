
import React, { useState, useEffect } from "react";
import { AuthContextProvider } from "./AuthContext";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { usePrivilegeCheck } from "@/hooks/usePrivilegeCheck";
import { AuthState, CustomPrivilege } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize auth state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true // Start with loading while we check auth status
  });
  
  // Initialize custom privileges
  const [customPrivileges, setCustomPrivileges] = useState<CustomPrivilege[]>([]);

  // Setup auth listener on initial load
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Session exists, user is authenticated
        if (session?.user) {
          // In a real app, you'd fetch the complete user profile here
          const user = session.user;
          setAuthState({
            user: {
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              role: user.user_metadata?.role || 'employee',
              avatar: user.user_metadata?.avatar_url,
              companyId: user.user_metadata?.company_id,
            },
            isAuthenticated: true,
            isLoading: false
          });
        }
      }
    });

    // Check for existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const user = session.user;
        setAuthState({
          user: {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            role: user.user_metadata?.role || 'employee',
            avatar: user.user_metadata?.avatar_url,
            companyId: user.user_metadata?.company_id,
          },
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
