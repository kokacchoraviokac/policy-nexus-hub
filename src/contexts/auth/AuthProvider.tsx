
import React, { useState, useEffect } from "react";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, AuthState, rolePrivileges } from "@/types/auth";
import { toast } from "sonner";
import { fetchUserProfile } from "@/utils/authUtils";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { AuthContextProvider } from "./AuthContext";
import { checkPrivilege } from "@/utils/authUtils";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [session, setSession] = useState<Session | null>(null);

  // Get auth operations
  const { login, logout, signUp, updateUser } = useAuthOperations(authState, setAuthState);

  // Function to check if user has a specific privilege
  const hasPrivilege = (privilege: string) => {
    if (!authState.user || !authState.isAuthenticated) {
      return false;
    }
    return checkPrivilege(authState.user.role, privilege);
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
              setAuthState({
                user: profile,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              // Fall back to session user data
              setAuthState({
                user: {
                  id: session.user.id,
                  name: session.user.email?.split('@')[0] || 'User',
                  email: session.user.email || '',
                  role: 'employee' as UserRole, // Default role
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
          } else {
            // Fall back to session user data
            setAuthState({
              user: {
                id: session.user.id,
                name: session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: 'employee' as UserRole, // Default role
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
    updateUser,
    signUp,
  };

  return (
    <AuthContextProvider value={contextValue}>
      {children}
    </AuthContextProvider>
  );
};
