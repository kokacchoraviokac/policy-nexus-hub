import React, { useState, useEffect } from "react";
import { AuthContextProvider } from "./AuthContext";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { usePrivilegeCheck } from "@/hooks/usePrivilegeCheck";
import { AuthState, CustomPrivilege } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_USERS } from "@/data/mockUsers";

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
    // Check for existing session first (including mock users in localStorage)
    const checkExistingAuth = async () => {
      try {
        // Check for mock user in localStorage first
        const mockUserEmail = localStorage.getItem('mockUserEmail');
        if (mockUserEmail) {
          const mockUser = MOCK_USERS.find(u => u.email === mockUserEmail);
          if (mockUser) {
            console.log("Restoring mock user session for:", mockUserEmail);
            setAuthState({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false
            });
            return; // Skip Supabase check if mock user is found
          }
        }

        // Otherwise check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const user = session.user;
          console.log("Found existing session with user:", user);
          console.log("User role:", user.user_metadata?.role);
          
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
      } catch (error) {
        console.error("Error checking auth state:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    // Initial check for existing session
    checkExistingAuth();
    
    // Set up the Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        // Also clear any mock user from localStorage
        localStorage.removeItem('mockUserEmail');
        
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Get auth operations
  const { login: baseLogin, logout, signUp, updateUser } = useAuthOperations(authState, setAuthState);

  // Enhanced login that preserves mock user sessions
  const login = async (email: string, password: string) => {
    const result = await baseLogin(email, password);
    
    // If this was a successful mock user login, store in localStorage for persistence
    if (!result.error) {
      const mockUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (mockUser) {
        localStorage.setItem('mockUserEmail', mockUser.email);
      }
    }
    
    return result;
  };

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
    // Custom privileges
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
