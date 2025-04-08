
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPrivilege?: string;
  contextData?: {
    ownerId?: string;
    companyId?: string;
    resourceType?: string;
    resourceValue?: any;
    [key: string]: any;
  };
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPrivilege,
  contextData,
}) => {
  const { isAuthenticated, isLoading, hasPrivilege, hasPrivilegeWithContext, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You might want to show a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has the required privilege
  if (requiredPrivilege) {
    let hasAccess = false;
    
    if (contextData) {
      // Use context-aware check if context data is provided
      hasAccess = hasPrivilegeWithContext(requiredPrivilege, contextData);
    } else {
      // Use simple check otherwise
      hasAccess = hasPrivilege(requiredPrivilege);
    }
    
    if (!hasAccess) {
      // Redirect to unauthorized page or dashboard
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If authenticated and has the required privilege, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
