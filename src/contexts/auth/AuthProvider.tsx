
import React, { useState, useEffect } from "react";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, AuthState, rolePrivileges, CustomPrivilege } from "@/types/auth";
import { toast } from "sonner";
import { fetchUserProfile, fetchUserCustomPrivileges } from "@/utils/authUtils";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { AuthContextProvider } from "./AuthContext";
import { checkPrivilege, checkPrivilegeWithContext } from "@/utils/authUtils";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [session, setSession] = useState<Session | null>(null);
  const [customPrivileges, setCustomPrivileges] = useState<CustomPrivilege[]>([]);

  // Get auth operations
  const { login, logout, signUp, updateUser } = useAuthOperations(authState, setAuthState);

  // Function to check if user has a specific privilege
  const hasPrivilege = (privilege: string) => {
    if (!authState.user || !authState.isAuthenticated) {
      return false;
    }
    
    // First check role-based privileges
    if (checkPrivilege(authState.user.role, privilege)) {
      return true;
    }
    
    // Then check custom privileges
    return customPrivileges.some(cp => cp.privilege === privilege);
  };
  
  // Enhanced function to check privileges with context
  const hasPrivilegeWithContext = (
    privilege: string,
    context?: {
      ownerId?: string;
      currentUserId?: string;
      companyId?: string;
      currentUserCompanyId?: string;
      resourceType?: string;
      resourceValue?: any;
      [key: string]: any;
    }
  ) => {
    if (!authState.user || !authState.isAuthenticated) {
      return false;
    }
    
    // Add user context if not provided
    const contextWithDefaults = {
      currentUserId: authState.user.id,
      currentUserCompanyId: authState.user.companyId,
      ...context
    };
    
    // Check role-based privileges first
    if (checkPrivilegeWithContext(authState.user.role, privilege, contextWithDefaults)) {
      return true;
    }
    
    // Then check custom privileges
    return customPrivileges.some(cp => cp.privilege === privilege);
  };

  // This effect sets up auth state listener and checks for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session && session.user) {
          try {
            // Fetch user profile from profiles table
            const profile = await fetchUserProfile(session.user.id);
            
            if (profile) {
              // Log successful profile load (only in dev)
              if (process.env.NODE_ENV === 'development') {
                console.log("Profile loaded:", profile);
              }
              
              setAuthState({
                user: profile,
                isAuthenticated: true,
                isLoading: false,
              });
              
              // Fetch custom privileges
              const userCustomPrivileges = await fetchUserCustomPrivileges(session.user.id);
              setCustomPrivileges(userCustomPrivileges);
            } else {
              // Fall back to session user data
              const defaultRole = session.user.user_metadata?.role || 'employee';
              console.warn("Profile not found, using session data with role:", defaultRole);
              
              setAuthState({
                user: {
                  id: session.user.id,
                  name: session.user.email?.split('@')[0] || 'User',
                  email: session.user.email || '',
                  role: defaultRole as UserRole,
                  avatar: session.user.user_metadata?.avatar_url,
                  companyId: session.user.user_metadata?.company_id,
                },
                isAuthenticated: true,
                isLoading: false,
              });
            }
          } catch (err) {
            console.error("Error in profile fetch:", err);
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          // No session, user is logged out
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          setCustomPrivileges([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session && session.user) {
        try {
          // Fetch user profile from profiles table
          const profile = await fetchUserProfile(session.user.id);
          
          if (profile) {
            setAuthState({
              user: profile,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Fetch custom privileges
            const userCustomPrivileges = await fetchUserCustomPrivileges(session.user.id);
            setCustomPrivileges(userCustomPrivileges);
          } else {
            // Fall back to session user data with better default role handling
            const defaultRole = session.user.user_metadata?.role || 'employee';
            console.warn("Profile not found, using session data with role:", defaultRole);
            
            setAuthState({
              user: {
                id: session.user.id,
                name: session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: defaultRole as UserRole,
                avatar: session.user.user_metadata?.avatar_url,
                companyId: session.user.user_metadata?.company_id,
              },
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (err) {
          console.error("Error in profile fetch:", err);
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        // No session, user is logged out
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
