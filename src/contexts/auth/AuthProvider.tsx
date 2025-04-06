import React, { createContext, useEffect, useReducer, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType } from "./types";
import { authReducer, initialState } from "./authReducer";
import { User, UserRole, CustomPrivilege } from "@/types/auth/userTypes";
import { ResourceContext } from "@/types/auth/contextTypes";
import { fetchUserCustomPrivileges, isValidPrivilege } from "@/utils/authUtils";

export const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();
  
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user profile and custom privileges
          const userProfile = await fetchUserProfile(session.user.id);
          let privileges: CustomPrivilege[] = [];
          
          if (userProfile) {
            privileges = await fetchUserCustomPrivileges(userProfile.id);
          }
          
          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              session,
              user: userProfile,
              customPrivileges: privileges
            }
          });
        } else {
          dispatch({ type: "AUTH_INITIALIZED" });
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        dispatch({ type: "AUTH_FAIL" });
      }
    };
    
    getSession();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "INITIAL_SESSION") {
          return;
        }
        
        if (session) {
          // Fetch user profile and custom privileges
          const userProfile = await fetchUserProfile(session.user.id);
          let privileges: CustomPrivilege[] = [];
          
          if (userProfile) {
            privileges = await fetchUserCustomPrivileges(userProfile.id);
          }
          
          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              session,
              user: userProfile,
              customPrivileges: privileges
            }
          });
        } else {
          dispatch({ type: "SIGN_OUT" });
        }
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Updated auth operations with correct return types
  const authOperations = useMemo(() => {
    return {
      // Standard auth operations
      signUp: async (email: string, password: string, userData?: Partial<User>): Promise<void> => {
        dispatch({ type: "AUTH_START" });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData
            }
          });
          
          if (error) {
            toast({
              title: "Sign Up Failed",
              description: error.message,
              variant: "destructive"
            });
            throw error;
          }
          
          // If auto-confirm is disabled, show a different message
          if (!data.user?.identities?.length) {
            toast({
              title: "Verification Email Sent",
              description: "Please check your email to confirm your account"
            });
          } else {
            toast({
              title: "Account Created",
              description: "Your account has been created successfully"
            });
          }
          
          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              session: data.session,
              user: null // User won't be available until they confirm their email
            }
          });
        } catch (error) {
          dispatch({ type: "AUTH_FAIL" });
          console.error("Sign up error:", error);
        }
      },
      
      signIn: async (email: string, password: string): Promise<void> => {
        dispatch({ type: "AUTH_START" });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
            toast({
              title: "Sign In Failed",
              description: error.message,
              variant: "destructive"
            });
            dispatch({ type: "AUTH_FAIL" });
            return;
          }
          
          // Fetch user profile and custom privileges
          const userProfile = await fetchUserProfile(data.user?.id);
          let privileges: CustomPrivilege[] = [];
          
          if (userProfile) {
            privileges = await fetchUserCustomPrivileges(userProfile.id);
          }
          
          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              session: data.session,
              user: userProfile,
              customPrivileges: privileges
            }
          });
          
          toast({
            title: "Welcome Back",
            description: `Signed in as ${email}`
          });
        } catch (error) {
          dispatch({ type: "AUTH_FAIL" });
          console.error("Sign in error:", error);
        }
      },
      
      signOut: async (): Promise<void> => {
        try {
          const { error } = await supabase.auth.signOut();
          
          if (error) {
            console.error("Sign out error:", error);
            return;
          }
          
          dispatch({ type: "SIGN_OUT" });
          
          toast({
            title: "Signed Out",
            description: "You have been signed out successfully"
          });
        } catch (error) {
          console.error("Sign out error:", error);
        }
      },
      
      updateUserProfile: async (profile: Partial<User>): Promise<void> => {
        if (!state.user) return;
        
        try {
          // Update auth metadata if needed
          if (profile.email || profile.name) {
            await supabase.auth.updateUser({
              email: profile.email,
              data: {
                name: profile.name
              }
            });
          }
          
          // Update profile in the profiles table
          const { error } = await supabase
            .from("profiles")
            .update({
              name: profile.name,
              avatar_url: profile.avatar,
              // Add other fields as needed
            })
            .eq("id", state.user.id);
          
          if (error) {
            toast({
              title: "Profile Update Failed",
              description: error.message,
              variant: "destructive"
            });
            return;
          }
          
          // Update local state
          dispatch({
            type: "UPDATE_USER",
            payload: {
              ...state.user,
              ...profile
            }
          });
          
          toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully"
          });
        } catch (error) {
          console.error("Profile update error:", error);
          toast({
            title: "Profile Update Failed",
            description: "An error occurred while updating your profile",
            variant: "destructive"
          });
        }
      },
      
      // Alias auth operations (for backward compatibility)
      login: async (email: string, password: string): Promise<{ error?: any }> => {
        dispatch({ type: "AUTH_START" });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
            dispatch({ type: "AUTH_FAIL" });
            return { error };
          }
          
          // Fetch user profile and custom privileges
          const userProfile = await fetchUserProfile(data.user?.id);
          let privileges: CustomPrivilege[] = [];
          
          if (userProfile) {
            privileges = await fetchUserCustomPrivileges(userProfile.id);
          }
          
          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              session: data.session,
              user: userProfile,
              customPrivileges: privileges
            }
          });
          
          return { error: null };
        } catch (error) {
          dispatch({ type: "AUTH_FAIL" });
          console.error("Login error:", error);
          return { error };
        }
      },
      
      logout: async (): Promise<void> => {
        await authOperations.signOut();
      },
      
      updateUser: async (profile: Partial<User>): Promise<void> => {
        await authOperations.updateUserProfile(profile);
      },
      
      initiatePasswordReset: async (email: string): Promise<boolean> => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
          });
          
          if (error) {
            toast({
              title: "Password Reset Failed",
              description: error.message,
              variant: "destructive"
            });
            return false;
          }
          
          toast({
            title: "Password Reset Initiated",
            description: "Please check your email for further instructions"
          });
          return true;
        } catch (error) {
          console.error("Password reset error:", error);
          toast({
            title: "Password Reset Failed",
            description: "An unexpected error occurred",
            variant: "destructive"
          });
          return false;
        }
      },
      
      updatePassword: async (newPassword: string): Promise<boolean> => {
        try {
          const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
          });
          
          if (error) {
            toast({
              title: "Password Update Failed",
              description: error.message,
              variant: "destructive"
            });
            return false;
          }
          
          toast({
            title: "Password Updated",
            description: "Your password has been updated successfully"
          });
          return true;
        } catch (error) {
          console.error("Password update error:", error);
          toast({
            title: "Password Update Failed",
            description: "An unexpected error occurred",
            variant: "destructive"
          });
          return false;
        }
      },
      
      refreshSession: async (): Promise<void> => {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) {
            console.error("Session refresh error:", error);
            return;
          }
          
          if (data.session) {
            // Fetch user profile and custom privileges
            const userProfile = await fetchUserProfile(data.session.user.id);
            let privileges: CustomPrivilege[] = [];
            
            if (userProfile) {
              privileges = await fetchUserCustomPrivileges(userProfile.id);
            }
            
            dispatch({
              type: "AUTH_SUCCESS",
              payload: {
                session: data.session,
                user: userProfile,
                customPrivileges: privileges
              }
            });
          }
        } catch (error) {
          console.error("Session refresh error:", error);
        }
      },

      // Helper functions for privilege checking
      hasPrivilege: (privilege: string): boolean => {
        if (!state.user) return false;
        
        // Check if user has admin role
        if (state.user.role === "admin" || state.user.role === "superAdmin") {
          return true;
        }
        
        // Check custom privileges
        return state.customPrivileges.some(p => 
          p.privilege === privilege && isValidPrivilege(p)
        );
      },
      
      hasPrivilegeWithContext: (privilege: string, context?: ResourceContext): boolean => {
        if (!state.user) return false;
        
        // Admin users have all privileges
        if (state.user.role === "admin" || state.user.role === "superAdmin") {
          return true;
        }
        
        // Check for exact privilege match first
        if (state.customPrivileges.some(p => 
          p.privilege === privilege && isValidPrivilege(p)
        )) {
          return true;
        }
        
        // Check for context-specific privileges
        if (context) {
          return state.customPrivileges.some(p => {
            if (!isValidPrivilege(p)) return false;
            
            // Handle different context types
            if (p.context && typeof p.context === 'string') {
              try {
                const parsedContext = JSON.parse(p.context);
                // Check each context property
                return Object.entries(context).every(([key, value]) => 
                  parsedContext[key] === value
                );
              } catch {
                // If parsing fails, check if privilege matches
                return p.privilege === privilege;
              }
            }
            
            return false;
          });
        }
        
        return false;
      },
      
      hasRole: (role: UserRole | UserRole[]): boolean => {
        if (!state.user) return false;
        
        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(state.user.role);
      },
      
      // Add custom properties
      get userProfile() {
        return state.user;
      },
      
      get isAuthenticated() {
        return !!state.user;
      },
      
      get role() {
        return state.user?.role || null;
      },
      
      get companyId() {
        return state.user?.companyId || state.user?.company_id || null;
      },
      
      get customPrivileges() {
        return state.customPrivileges;
      },
      
      get isInitialized() {
        return state.isInitialized;
      },
      
      get isLoading() {
        return state.isLoading;
      },
      
      get user() {
        return state.user;
      },
      
      get session() {
        return state.session;
      }
    };
  }, [state, toast]);

  // Helper function for fetching user profile
  async function fetchUserProfile(userId?: string): Promise<User | null> {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
    
      if (error || !data) {
        console.error("Error fetching user profile:", error);
        return null;
      }
    
      // Convert the profile data to our User type
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        companyId: data.company_id,
        company_id: data.company_id, // For backward compatibility
        avatar: data.avatar_url
      };
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  }

  return (
    <AuthContext.Provider value={authOperations}>
      {children}
    </AuthContext.Provider>
  );
};
