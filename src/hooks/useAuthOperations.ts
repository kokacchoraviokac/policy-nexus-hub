
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, AuthState } from "@/types/auth";
import { toast } from "sonner";
import { MOCK_USERS } from "@/data/mockUsers";
import { fetchUserProfile, updateUserProfile } from "@/utils/authUtils";

export const useAuthOperations = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setAuthState({ ...authState, isLoading: true });
    
    try {
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        
        // Fall back to mock login for demo (only in development)
        if (process.env.NODE_ENV === 'development') {
          const mockUser = MOCK_USERS.find(u => u.email === email);
          
          if (mockUser) {
            console.log("Using mock user login for development");
            setAuthState({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        }
        
        throw error;
      }
      
      // Real Supabase auth - user profile is handled by the onAuthStateChange listener
      console.log("Supabase login successful");
    } catch (error) {
      console.error("Login failed:", error);
      setAuthState({ ...authState, isLoading: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Auth state will be updated by the onAuthStateChange listener
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout anyway
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setAuthState({ ...authState, isLoading: true });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'employee',
            company_id: userData.companyId,
            avatar_url: userData.avatar
          },
        },
      });
      
      if (error) {
        toast.error(`Sign up failed: ${error.message}`);
        throw error;
      }
      
      toast.success('Sign up successful! Verification email sent.');
      
      // NOTE: User profile is created automatically via the database trigger
    } catch (error) {
      console.error("Sign up failed:", error);
      setAuthState({ ...authState, isLoading: false });
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!authState.user || !authState.isAuthenticated) {
      console.error("Cannot update user: No authenticated user");
      return;
    }
    
    const success = await updateUserProfile(authState.user.id, userData);
    
    if (success) {
      // Update local state
      setAuthState({
        ...authState,
        user: { ...authState.user, ...userData },
      });
    }
  };

  return {
    login,
    logout,
    signUp,
    updateUser
  };
};
