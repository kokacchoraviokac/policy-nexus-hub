
import React, { createContext, useContext, useState } from "react";
import { AuthContextType } from "./types";
import { AuthState, CustomPrivilege } from "@/types/auth";

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial auth state
const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false
};

// Auth context provider props
interface AuthProviderProps {
  children: React.ReactNode;
  value: AuthContextType;
}

// Auth context provider component
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

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
