
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, AuthContextType, UserRole, CustomPrivilege } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  role: null,
  companyId: null,
  customPrivileges: [],
  login: async () => ({ error: null }),
  logout: async () => {},
  signup: async () => ({ error: null }),
  hasPrivilege: () => false,
  hasPrivilegeWithContext: () => false,
  updateUser: async () => ({ error: null }),
  initiatePasswordReset: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [customPrivileges, setCustomPrivileges] = useState<CustomPrivilege[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if the user is authenticated on component mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData.user) {
            // Get user profile from database
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userData.user.id)
              .single();
            
            if (profileData) {
              setUserProfile(profileData);
              setRole(profileData.role as UserRole);
              setCompanyId(profileData.company_id);
              
              // Get custom privileges
              const { data: privilegeData } = await supabase
                .from('user_custom_privileges')
                .select('*')
                .eq('user_id', userData.user.id);
              
              if (privilegeData) {
                setCustomPrivileges(privilegeData as CustomPrivilege[]);
              }
            }
            
            // Set user state
            setUser({
              ...userData.user,
              name: profileData?.name || userData.user.email?.split('@')[0] || 'User',
              role: profileData?.role || 'employee',
              companyId: profileData?.company_id
            });
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // User has signed in
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData.user) {
          // Get user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userData.user.id)
            .single();
          
          if (profileData) {
            setUserProfile(profileData);
            setRole(profileData.role as UserRole);
            setCompanyId(profileData.company_id);
            
            // Get custom privileges
            const { data: privilegeData } = await supabase
              .from('user_custom_privileges')
              .select('*')
              .eq('user_id', userData.user.id);
            
            if (privilegeData) {
              setCustomPrivileges(privilegeData as CustomPrivilege[]);
            }
          }
          
          // Set user state
          setUser({
            ...userData.user,
            name: profileData?.name || userData.user.email?.split('@')[0] || 'User',
            role: profileData?.role || 'employee',
            companyId: profileData?.company_id
          });
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        // User has signed out
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        setRole(null);
        setCompanyId(null);
        setCustomPrivileges([]);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      if (data.user) {
        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileData) {
          setUserProfile(profileData);
          setRole(profileData.role as UserRole);
          setCompanyId(profileData.company_id);
          
          // Get custom privileges
          const { data: privilegeData } = await supabase
            .from('user_custom_privileges')
            .select('*')
            .eq('user_id', data.user.id);
          
          if (privilegeData) {
            setCustomPrivileges(privilegeData as CustomPrivilege[]);
          }
        }
        
        // Set user state
        setUser({
          ...data.user,
          name: profileData?.name || data.user.email?.split('@')[0] || 'User',
          role: profileData?.role || 'employee',
          companyId: profileData?.company_id
        });
        setIsAuthenticated(true);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate('/dashboard');
      }
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      setRole(null);
      setCompanyId(null);
      setCustomPrivileges([]);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'employee', // Default role
          },
        },
      });
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Signup successful",
        description: "Please check your email for verification.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };
  
  // Check if user has a specific privilege
  const hasPrivilege = (privilege: string): boolean => {
    // Super admin has all privileges
    if (role === 'superAdmin') return true;
    
    // Check custom privileges
    return customPrivileges.some(p => 
      p.privilege === privilege && 
      (!p.expires_at || new Date(p.expires_at) > new Date())
    );
  };
  
  // Check if user has a privilege in a specific context (e.g., for a specific entity)
  const hasPrivilegeWithContext = (privilege: string, context?: string): boolean => {
    // Super admin has all privileges
    if (role === 'superAdmin') return true;
    
    // If no context, use simple check
    if (!context) return hasPrivilege(privilege);
    
    // Check custom privileges with context
    return customPrivileges.some(p => 
      p.privilege === privilege && 
      (!p.expires_at || new Date(p.expires_at) > new Date()) &&
      (p.context === context || p.context === '*')
    );
  };
  
  // Update user information
  const updateUser = async (userData: Partial<User>) => {
    if (!user) return { error: new Error('No user logged in') };
    
    try {
      // Update auth data if email is being changed
      if (userData.email) {
        const { error } = await supabase.auth.updateUser({
          email: userData.email,
        });
        
        if (error) {
          toast({
            title: "Update failed",
            description: error.message,
            variant: "destructive",
          });
          return { error };
        }
      }
      
      // Update profile data
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          avatar_url: userData.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      // Update local state
      setUser({ ...user, ...userData });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };
  
  // Initiate password reset
  const initiatePasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for a reset link.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };
  
  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Password update failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAuthenticated,
        isLoading,
        isInitialized,
        role,
        companyId,
        customPrivileges,
        login,
        logout,
        signup,
        hasPrivilege,
        hasPrivilegeWithContext,
        updateUser,
        initiatePasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
