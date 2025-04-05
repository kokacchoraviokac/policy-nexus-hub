import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User, AuthState } from "@/types/auth";

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
      
      const { data: user, error: userError } = await supabase
        .from('users')
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
        isAuthenticated: true,
        isLoading: false,
      }));
      
    } catch (error: any) {
      console.error("Signup failed:", error);
      setState(prevState => ({
        ...prevState,
        user: null,
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
      
      const { data: user, error: userError } = await supabase
        .from('users')
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
      
    } catch (error: any) {
      console.error("Signin failed:", error);
      setState(prevState => ({
        ...prevState,
        user: null,
        session: null, // Include session
        isAuthenticated: false,
        isLoading: false,
      }));
      throw error;
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

  return { signUp, signIn, signOut };
};

export default useAuthOperations;
