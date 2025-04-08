
import { User, UserRole, CustomPrivilege } from "@/types/auth";
import { checkPrivilege, checkPrivilegeWithContext } from "@/utils/authUtils";

export function usePrivilegeCheck(
  user: User | null,
  isAuthenticated: boolean,
  customPrivileges: CustomPrivilege[]
) {
  // Function to check if user has a specific privilege
  const hasPrivilege = (privilege: string) => {
    if (!user || !isAuthenticated) {
      console.log("No authenticated user found in hasPrivilege check");
      return false;
    }
    
    console.log(`Checking privilege '${privilege}' for user with role '${user.role}'`);
    
    // First check role-based privileges
    if (checkPrivilege(user.role, privilege)) {
      console.log(`Role-based privilege '${privilege}' granted for role '${user.role}'`);
      return true;
    }
    
    // Then check custom privileges
    const hasCustomPrivilege = customPrivileges.some(cp => cp.privilege === privilege);
    if (hasCustomPrivilege) {
      console.log(`Custom privilege '${privilege}' found`);
    }
    
    return hasCustomPrivilege;
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
