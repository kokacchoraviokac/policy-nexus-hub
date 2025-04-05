
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth/AuthContext';
import { ResourceContext } from '@/types/auth/contextTypes';

export function usePrivilegeCheck() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('usePrivilegeCheck must be used within an AuthProvider');
  }
  
  /**
   * Check if the current user has the specified privilege
   */
  const checkPrivilege = (privilege: string): boolean => {
    if (!context.user) {
      return false;
    }
    
    // If the privilege is an array, convert it to a string
    const privilegeToCheck = Array.isArray(privilege) ? privilege[0] : privilege;
    
    return context.hasPrivilege(privilegeToCheck);
  };
  
  /**
   * Check if the current user has the specified privilege with context
   */
  const checkPrivilegeWithContext = (privilege: string, resourceContext?: ResourceContext): boolean => {
    if (!context.user) {
      return false;
    }
    
    // If the privilege is an array, convert it to a string
    const privilegeToCheck = Array.isArray(privilege) ? privilege[0] : privilege;
    
    return context.hasPrivilegeWithContext(privilegeToCheck, resourceContext);
  };
  
  /**
   * Check if the current user has any of the specified privileges
   */
  const checkAnyPrivilege = (privileges: string[]): boolean => {
    if (!context.user || !privileges.length) {
      return false;
    }
    
    return privileges.some(privilege => checkPrivilege(privilege));
  };
  
  return {
    checkPrivilege,
    checkPrivilegeWithContext,
    checkAnyPrivilege
  };
}
