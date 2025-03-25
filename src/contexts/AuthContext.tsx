
import React, { createContext, useContext, useState, useEffect } from "react";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, AuthState, rolePrivileges } from "@/types/auth";
import { toast } from "sonner";

// Mock user data for development when not connected to Supabase
const MOCK_USERS = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@policyhub.com",
    role: "superAdmin" as UserRole,
    avatar: undefined,
  },
  {
    id: "2",
    name: "Broker Admin",
    email: "admin@example.com",
    role: "admin" as UserRole,
    companyId: "company1",
    avatar: undefined,
  },
  {
    id: "3",
    name: "Employee User",
    email: "employee@example.com",
    role: "employee" as UserRole,
    companyId: "company1",
    avatar: undefined,
  }
];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPrivilege: (privilege: string) => boolean;
  updateUser: (user: Partial<User>) => void;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [session, setSession] = useState<Session | null>(null);

  // This effect sets up auth state listener and checks for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session && session.user) {
          try {
            // Fetch user profile from profiles table
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('name, email, role, avatar_url, company_id')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error("Error fetching user profile:", error);
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
              return;
            }

            // Use profile data
            if (profile) {
              setAuthState({
                user: {
                  id: session.user.id,
                  name: profile.name,
                  email: profile.email,
                  role: profile.role as UserRole,
                  avatar: profile.avatar_url,
                  companyId: profile.company_id,
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
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('name, email, role, avatar_url, company_id')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
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
            return;
          }

          // Use profile data
          if (profile) {
            setAuthState({
              user: {
                id: session.user.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole,
                avatar: profile.avatar_url,
                companyId: profile.company_id,
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

  const hasPrivilege = (privilege: string) => {
    if (!authState.user || !authState.isAuthenticated) {
      return false;
    }

    const userRole = authState.user.role;
    const userPrivileges = rolePrivileges[userRole];
    
    return userPrivileges.includes(privilege);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!authState.user || !authState.isAuthenticated) {
      console.error("Cannot update user: No authenticated user");
      return;
    }
    
    try {
      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          avatar_url: userData.avatar,
          // Only update role or company_id if explicitly provided
          ...(userData.role && { role: userData.role }),
          ...(userData.companyId && { company_id: userData.companyId }),
        })
        .eq('id', authState.user.id);
      
      if (error) {
        console.error("Error updating profile:", error);
        toast.error(`Failed to update profile: ${error.message}`);
        return;
      }
      
      // Update local state
      setAuthState({
        ...authState,
        user: { ...authState.user, ...userData },
      });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        hasPrivilege,
        updateUser,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
