
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { AuthContextType } from "./types";
import { UserRole, CustomPrivilege } from "@/types/auth";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  company_id?: string;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  role: null,
  companyId: null,
  isInitialized: false,
  isLoading: false,
  isAuthenticated: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => {},
  login: async () => ({ error: null }),
  logout: async () => {},
  updateUser: async () => {},
  hasPrivilege: () => false,
  hasPrivilegeWithContext: () => false,
  customPrivileges: [],
  initiatePasswordReset: async () => false,
  updatePassword: async () => false
});

interface AuthProviderProps {
  children: React.ReactNode;
  value: AuthContextType;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({ 
  children,
  value
}) => {
  return (
    <AuthContext.Provider value={value}>
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
