
import { useState, useEffect } from "react";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { User, AuthState } from "@/types/auth";
import { fetchUserProfile, fetchUserCustomPrivileges } from "@/utils/authUtils";

export function useAuthSession(): {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  session: Session | null;
  customPrivileges: any[];
  setCustomPrivileges: React.Dispatch<React.SetStateAction<any[]>>;
} {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [session, setSession] = useState<Session | null>(null);
  const [customPrivileges, setCustomPrivileges] = useState<any[]>([]);

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
                  role: defaultRole as any,
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
                role: defaultRole as any,
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

  return { authState, setAuthState, session, customPrivileges, setCustomPrivileges };
}
