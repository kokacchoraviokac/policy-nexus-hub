
import { useAuth } from "@/contexts/auth/AuthContext";
import { User, UserRole, CustomPrivilege } from "@/types/auth";
import { checkPrivilege, checkPrivilegeWithContext } from "@/utils/authUtils";

export function usePrivilegeCheck() {
  const { user, customPrivileges, isAuthenticated } = useAuth();

  // Function to check if user has a specific privilege
  const hasPrivilege = (privilege: string) => {
    if (!user || !isAuthenticated) {
      return false;
    }
    
    // First check role-based privileges
    if (checkPrivilege(user.role, privilege)) {
      return true;
    }
    
    // Then check custom privileges
    return customPrivileges.some(cp => cp.privilege === privilege);
  };
  
  // Enhanced function to check privileges with context
  const hasPrivilegeWithContext = (
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
    if (!user || !isAuthenticated) {
      return false;
    }
    
    // Add user context if not provided
    const contextWithDefaults = {
      currentUserId: user.id,
      currentUserCompanyId: user.companyId,
      ...context
    };
    
    // Check role-based privileges first
    if (checkPrivilegeWithContext(user.role, privilege, contextWithDefaults)) {
      return true;
    }
    
    // Then check custom privileges
    return customPrivileges.some(cp => cp.privilege === privilege);
  };

  return {
    hasPrivilege,
    hasPrivilegeWithContext
  };
}
