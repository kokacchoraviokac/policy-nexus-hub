
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, AuthState, rolePrivileges } from "@/types/auth";

// Mock user data for development purposes
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("policyHubUser");
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("policyHubUser");
        setAuthState({ ...authState, isLoading: false });
      }
    } else {
      setAuthState({ ...authState, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setAuthState({ ...authState, isLoading: true });
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (mock authentication)
      const user = MOCK_USERS.find(u => u.email === email);
      
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem("policyHubUser", JSON.stringify(user));
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setAuthState({ ...authState, isLoading: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("policyHubUser");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const hasPrivilege = (privilege: string) => {
    if (!authState.user || !authState.isAuthenticated) {
      return false;
    }

    const userRole = authState.user.role;
    const userPrivileges = rolePrivileges[userRole];
    
    return userPrivileges.includes(privilege);
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      setAuthState({
        ...authState,
        user: updatedUser,
      });
      localStorage.setItem("policyHubUser", JSON.stringify(updatedUser));
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
