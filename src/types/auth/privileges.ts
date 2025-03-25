
import { UserRole } from './user';
import { rolePrivileges } from './roles';
import { ResourceContext } from './contextTypes';

// Enhanced permission checking function to support granular checks
export const checkGranularPrivilege = (
  role: UserRole | undefined,
  privilege: string,
  resourceContext?: ResourceContext
): boolean => {
  if (!role) return false;
  
  const userPrivileges = rolePrivileges[role];
  
  // Check for exact privilege match first
  if (userPrivileges.includes(privilege)) return true;
  
  // Check for module-level privilege (backward compatibility)
  const moduleLevelPrivilege = privilege.split('.')[0];
  if (userPrivileges.includes(`${moduleLevelPrivilege}:view`) && privilege.endsWith(':view')) return true;
  if (userPrivileges.includes(`${moduleLevelPrivilege}:edit`) && privilege.endsWith(':edit')) return true;
  if (userPrivileges.includes(`${moduleLevelPrivilege}:create`) && privilege.endsWith(':create')) return true;
  if (userPrivileges.includes(`${moduleLevelPrivilege}:delete`) && privilege.endsWith(':delete')) return true;
  
  // Context-based checks
  if (resourceContext) {
    // Own resource check
    if (
      privilege.includes('.own:') && 
      resourceContext.ownerId === resourceContext.currentUserId &&
      userPrivileges.includes(privilege)
    ) {
      return true;
    }
    
    // Company resource check
    if (
      privilege.includes('.company:') && 
      resourceContext.companyId === resourceContext.currentUserCompanyId &&
      userPrivileges.includes(privilege)
    ) {
      return true;
    }
    
    // Value-based checks (like highValue claims)
    if (
      privilege.includes('.highValue:') && 
      resourceContext.resourceType === 'amount' && 
      resourceContext.resourceValue < 10000 && // Example threshold
      userPrivileges.includes(privilege.replace('highValue', 'all'))
    ) {
      return true;
    }
  }
  
  return false;
};
