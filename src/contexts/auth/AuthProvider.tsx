import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, AuthState } from "@/types/auth";
import { AuthContextType } from "./types";
import useAuthOperations from "@/hooks/useAuthOperations";
import { fetchUserCustomPrivileges } from "@/utils/auth/privilegeUtils";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setState] = useState<AuthState>({
    session: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  
  const [customPrivileges, setCustomPrivileges] = useState<any[]>([]);
  
  const { session, user, isAuthenticated, isLoading } = authState;
  
  const {
    login,
    logout,
    signUp: register,
    updateUser,
    initiatePasswordReset,
    updatePassword
  } = useAuthOperations(setState);
  
  // Fetch user custom privileges
  const fetchCustomPrivileges = useCallback(async (userId: string) => {
    const privileges = await fetchUserCustomPrivileges(userId);
    setCustomPrivileges(privileges);
  }, []);
  
  // Function to check if user has a specific privilege
  const hasPrivilege = useCallback((privilege: string) => {
    if (!user) return false;
    
    // Check if the user has the privilege directly
    const hasDirectPrivilege = customPrivileges.some(
      (p:any) => p.privilege === privilege && p.user_id === user.id
    );
    
    return hasDirectPrivilege;
  }, [customPrivileges, user]);
  
  const hasPrivilegeWithContext = useCallback((
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
    if (!user) return false;
    
    // Check if the user has the privilege directly
    const hasDirectPrivilege = customPrivileges.some(p => {
      if (p.privilege !== privilege || p.user_id !== user.id) {
        return false;
      }
      
      if (!p.context && !context) {
        return true;
      }
      
      if (!p.context || !context) {
        return false;
      }
      
      // Check if all context properties match
      for (const key in context) {
        if (context.hasOwnProperty(key)) {
          if (p.context[key] !== context[key]) {
            return false;
          }
        }
      }
      
      return true;
    });
    
    return hasDirectPrivilege;
  }, [customPrivileges, user]);

  // Initialize the authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: { user: supaUser } } = await supabase.auth.getUser();
        
        if (supaUser) {
          const userData = supaUser.user_metadata;
          const userRole = userData?.role as UserRole || 'employee';
          
          const user: User = {
            id: supaUser.id,
            email: supaUser.email || '',
            name: userData?.name || supaUser.email || 'User',
            role: userRole,
            companyId: userData?.companyId || userData?.company_id || '',
            avatar: userData?.avatar || '',
            user_metadata: supaUser.user_metadata
          };
          
          setState(prevState => ({
            ...prevState,
            session: session,
            user: user,
            isAuthenticated: true,
            isLoading: false,
          }));
          
          // Fetch custom privileges after setting the user
          await fetchCustomPrivileges(supaUser.id);
        } else {
          setState(prevState => ({
            ...prevState,
            session: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }));
        }
      } else {
        setState(prevState => ({
          ...prevState,
          session: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }));
      }
    };
    
    initializeAuth();
    
    // Subscribe to auth state changes
    const { subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          const { data: { user: supaUser } } = await supabase.auth.getUser();
          
          if (supaUser) {
            const userData = supaUser.user_metadata;
            const userRole = userData?.role as UserRole || 'employee';
            
            const user: User = {
              id: supaUser.id,
              email: supaUser.email || '',
              name: userData?.name || supaUser.email || 'User',
              role: userRole,
              companyId: userData?.companyId || userData?.company_id || '',
              avatar: userData?.avatar || '',
              user_metadata: supaUser.user_metadata
            };
            
            setState(prevState => ({
              ...prevState,
              session: session,
              user: user,
              isAuthenticated: true,
              isLoading: false,
            }));
            
            // Fetch custom privileges after setting the user
            await fetchCustomPrivileges(supaUser.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setState(prevState => ({
            ...prevState,
            session: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }));
        }
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchCustomPrivileges]);
  
  const signUp = async (email: string, password: string, userData?: Partial<User>) => {
    try {
      await register(email, password, userData);
    } catch (error: any) {
      console.error("Error during sign up:", error.message);
      throw error;
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error: any) {
      console.error("Error during sign in:", error.message);
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error("Error during sign out:", error.message);
      throw error;
    }
  };
  
  const updateUserProfile = async (profile: Partial<User>) => {
    try {
      await updateUser(profile);
    } catch (error: any) {
      console.error("Error updating user profile:", error.message);
      throw error;
    }
  };
  
  const authContextValue: AuthContextType = {
    user,
    userProfile: user,
    session,
    role: user?.role || null,
    companyId: user?.companyId || null,
    isInitialized: true,
    isAuthenticated: !!user,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    login,
    logout,
    updateUser,
    hasPrivilege,
    hasPrivilegeWithContext,
    customPrivileges,
    initiatePasswordReset,
    updatePassword
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
