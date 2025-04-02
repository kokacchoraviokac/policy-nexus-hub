
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, AuthState } from "@/types/auth";
import { toast } from "sonner";
import { MOCK_USERS } from "@/data/mockUsers";
import { fetchUserProfile, updateUserProfile, ensureUserProfile } from "@/utils/authUtils";

export const useAuthOperations = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setAuthState({ ...authState, isLoading: true });
    
    try {
      // First check if the email matches a mock user - allow in all environments
      const mockUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (mockUser) {
        console.log("Using mock user login for:", email);
        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
        return { error: null };
      }
      
      // If no matching mock user, try Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        throw error;
      }
      
      // Real Supabase auth - user profile is handled by the onAuthStateChange listener
      console.log("Supabase login successful");
      
      return { error: null };
    } catch (error) {
      console.error("Login failed:", error);
      setAuthState({ ...authState, isLoading: false });
      return { error };
    }
  };

  const logout = async () => {
    try {
      setAuthState({ ...authState, isLoading: true });
      
      // Check if we're dealing with a mock user
      const isMockUser = authState.user ? MOCK_USERS.some(u => u.id === authState.user?.id) : false;
      
      if (!isMockUser) {
        // Only call Supabase signOut if using a real auth session
        await supabase.auth.signOut();
      }
      
      // Always reset auth state regardless of mock or real user
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      return;
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout anyway
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setAuthState({ ...authState, isLoading: true });
    
    try {
      // Ensure userData has required fields with defaults
      const enrichedUserData = {
        name: userData.name || email.split('@')[0],
        role: userData.role || 'employee',
        companyId: userData.companyId,
        avatar: userData.avatar,
        ...userData
      };
      
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: enrichedUserData.name,
            role: enrichedUserData.role,
            company_id: enrichedUserData.companyId,
            avatar_url: enrichedUserData.avatar
          },
        },
      });
      
      if (error) {
        toast.error(`Sign up failed: ${error.message}`);
        throw error;
      }
      
      // Manually ensure profile creation in case trigger fails
      if (data.user) {
        await ensureUserProfile(data.user.id, {
          ...enrichedUserData,
          email,
        });
      }
      
      toast.success('Sign up successful! Verification email sent.');
      
      // NOTE: User profile is created automatically via the database trigger
      // but we've added a backup ensureUserProfile call above
    } catch (error) {
      console.error("Sign up failed:", error);
      setAuthState({ ...authState, isLoading: false });
      throw error;
    } finally {
      setAuthState({ ...authState, isLoading: false });
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!authState.user || !authState.isAuthenticated) {
      console.error("Cannot update user: No authenticated user");
      return Promise.reject("No authenticated user");
    }
    
    const success = await updateUserProfile(authState.user.id, userData);
    
    if (success) {
      // Update local state
      setAuthState({
        ...authState,
        user: { ...authState.user, ...userData },
      });
      return Promise.resolve();
    } else {
      return Promise.reject("Failed to update user profile");
    }
  };

  return {
    login,
    logout,
    signUp,
    updateUser
  };
};
