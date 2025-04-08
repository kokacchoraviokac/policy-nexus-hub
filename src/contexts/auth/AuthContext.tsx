
import React, { createContext, useContext } from "react";
import { AuthContextType } from "./types";

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
