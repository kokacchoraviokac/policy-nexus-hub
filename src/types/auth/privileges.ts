
export interface CustomPrivilege {
  id: string;
  privilege: string;
  context?: Record<string, any>;
  description?: string;
  grantedBy?: string;
  grantedAt?: Date;
  expiresAt?: Date;
  userId?: string;
}

// Function to check if a user has granular privileges based on context
export const checkGranularPrivilege = (
  role: string | undefined,
  privilege: string,
  context?: Record<string, any>
): boolean => {
  // Basic implementation - can be expanded with more complex logic
  if (!role) return false;
  
  // If this is an "own resource" check
  if (privilege.includes('.own:') && context) {
    const { ownerId, currentUserId } = context;
    // Resource is owned by the current user
    if (ownerId && currentUserId && ownerId === currentUserId) {
      return true;
    }
  }
  
  // If this is a "company resource" check
  if (privilege.includes('.company:') && context) {
    const { companyId, currentUserCompanyId } = context;
    // Resource belongs to the user's company
    if (companyId && currentUserCompanyId && companyId === currentUserCompanyId) {
      return true;
    }
  }
  
  // Add more specialized checks here as needed
  
  // Fall back to simple privilege check
  const rolePrivileges = {
    superAdmin: ["*"],
    admin: ["policies:*", "claims:*", "finances:*", "reports:*", "users:manage"],
    employee: ["policies.own:*", "claims.own:*", "reports.own:*"]
  };
  
  // Return true if user has wildcard privileges
  if (role === 'superAdmin') return true;
  
  // Check if the role exists in our privileges map
  if (role in rolePrivileges) {
    const allowedPrivileges = rolePrivileges[role as keyof typeof rolePrivileges];
    
    // Direct match
    if (allowedPrivileges.includes(privilege)) return true;
    
    // Wildcard matches (e.g., "policies:*" matches "policies:view")
    for (const allowed of allowedPrivileges) {
      if (allowed.endsWith(':*') && privilege.startsWith(allowed.replace('*', ''))) {
        return true;
      }
    }
  }
  
  return false;
};
