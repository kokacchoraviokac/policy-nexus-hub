
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User, AuthState } from "@/types/auth";
import { safeSupabaseQuery } from '@/utils/supabaseQueryHelper';

interface UseAuthOperations {
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const useAuthOperations = ({ setState }: UseAuthOperations) => {
  const signUp = useCallback(async (email: string, password: string, userData?: Partial<User>) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData?.name,
            role: userData?.role || 'employee',
            companyId: userData?.companyId,
            avatar: userData?.avatar,
          },
        },
      });
      
      if (authError) {
        console.error("Signup error:", authError);
        throw authError;
      }
      
      const { data: user, error: userError } = await safeSupabaseQuery('users')
        .insert([
          {
            id: authData.user?.id,
            email,
            name: userData?.name,
            role: userData?.role || 'employee',
            companyId: userData?.companyId,
            avatar: userData?.avatar,
          },
        ])
        .select()
        .single();
        
      if (userError) {
        console.error("User creation error:", userError);
        throw userError;
      }
      
      setState(prevState => ({
        ...prevState,
        user: user as User,
        session: authData.session,
        isAuthenticated: true,
        isLoading: false,
      }));
      
    } catch (error: any) {
      console.error("Signup failed:", error);
      setState(prevState => ({
        ...prevState,
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      }));
      throw error;
    }
  }, [setState]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Signin error:", error);
        throw error;
      }
      
      const { data: user, error: userError } = await safeSupabaseQuery('users')
        .select()
        .eq('id', data.user?.id)
        .single();
        
      if (userError) {
        console.error("User fetch error:", userError);
        throw userError;
      }
      
      setState(prevState => ({
        ...prevState,
        user: user as User,
        session: data.session, // Make sure session is included
        isAuthenticated: true,
        isLoading: false,
      }));
      
      return { error: null };
      
    } catch (error: any) {
      console.error("Signin failed:", error);
      setState(prevState => ({
        ...prevState,
        user: null,
        session: null, // Include session
        isAuthenticated: false,
        isLoading: false,
      }));
      return { error };
    }
  }, [setState]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Signout error:", error);
        throw error;
      }
      setState(prevState => ({
        ...prevState,
        user: null,
        session: null, // Include session
        isAuthenticated: false,
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Signout failed:", error);
      throw error;
    }
  }, [setState]);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) {
        throw error;
      }
      
      setState(prevState => ({
        ...prevState,
        user: {
          ...prevState.user!,
          ...userData
        } as User,
        session: data.session,
      }));
      
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  }, [setState]);

  const initiatePasswordReset = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error) {
      console.error("Password reset error:", error);
      return { error };
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error) {
      console.error("Update password error:", error);
      return { error };
    }
  }, []);

  return { 
    signUp, 
    signIn, 
    signOut,
    login: signIn, 
    logout: signOut,
    updateUser,
    initiatePasswordReset,
    updatePassword
  };
};

export default useAuthOperations;
