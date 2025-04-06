
import React, { createContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/auth/userTypes";
import { AuthState, AuthContextType } from "@/types/auth/contextTypes";
import useAuthOperations from "@/hooks/useAuthOperations";
import { fetchUserCustomPrivileges } from "@/utils/authUtils";

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
    signUp: register,
    signIn,
    signOut,
    updateUser,
  } = useAuthOperations({ setState });
  
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

  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role as UserRole);
    }
    
    return user.role === role;
  }, [user]);

  // Initialize the authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: { user: supaUser } } = await supabase.auth.getUser();
        
        if (supaUser) {
          const userData = supaUser.user_metadata;
          const userRole = userData?.role || 'employee';
          
          const user: User = {
            id: supaUser.id,
            email: supaUser.email || '',
            name: userData?.name || supaUser.email || 'User',
            role: userRole as UserRole,
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
    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          const { data: { user: supaUser } } = await supabase.auth.getUser();
          
          if (supaUser) {
            const userData = supaUser.user_metadata;
            const userRole = userData?.role || 'employee';
            
            const user: User = {
              id: supaUser.id,
              email: supaUser.email || '',
              name: userData?.name || supaUser.email || 'User',
              role: userRole as UserRole,
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
      data.subscription?.unsubscribe();
    };
  }, [fetchCustomPrivileges]);
  
  const refreshSession = async () => {
    const { data: { session } } = await supabase.auth.refreshSession();
    
    if (session) {
      setState(prevState => ({
        ...prevState,
        session,
      }));
    }
  };
  
  const updateUserProfile = async (profile: Partial<User>) => {
    await updateUser(profile);
  };
  
  const login = async (email: string, password: string): Promise<{ error?: any }> => {
    try {
      const result = await signIn(email, password);
      return { error: undefined };
    } catch (error) {
      // Rethrow to let caller handle it
      return { error };
    }
  };
  
  const logout = async (): Promise<void> => {
    await signOut();
  };
  
  const initiatePasswordReset = async (email: string): Promise<boolean> => {
    try {
      // This is a mock implementation - you'll need to replace it with your actual implementation
      console.log(`Initiating password reset for ${email}`);
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      return false;
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      // This is a mock implementation - you'll need to replace it with your actual implementation
      console.log('Updating password');
      return true;
    } catch (error) {
      console.error("Update password error:", error);
      return false;
    }
  };
  
  const authContextValue: AuthContextType = {
    user,
    session,
    role: user?.role,
    companyId: user?.companyId,
    isAuthenticated: !!user,
    isLoading,
    signUp: register,
    signIn,
    signOut,
    updateUser,
    login,
    logout,
    hasPrivilege,
    hasPrivilegeWithContext,
    hasRole,
    customPrivileges,
    initiatePasswordReset,
    updatePassword,
    refreshSession,
    userProfile: user,
    isInitialized: true,
    updateUserProfile,
    permissions: []
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
