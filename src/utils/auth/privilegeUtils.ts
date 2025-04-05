
import { CustomPrivilege } from "@/types/auth";
import { ResourceContext } from "@/types/auth/contextTypes";
import { UserRole } from "@/types/auth/user";

// Mock data for demonstration (replace with actual implementation)
const rolePrivilegeMap: Record<UserRole, string[]> = {
  superAdmin: ['*'], // superAdmin can do everything
  super_admin: ['*'], // alternative naming
  admin: [
    'policies:view', 'policies:create', 'policies:edit',
    'claims:view', 'claims:create',
    'finances:view',
    'users:manage'
  ],
  employee: [
    'policies:view',
    'claims:view'
  ],
  agent: [
    'policies:view',
    'clients:view',
    'commissions:view'
  ],
  client: [
    'policies.own:view',
    'claims.own:view',
    'documents.own:view'
  ]
};

// Check if a given role has a specific privilege
export function checkPrivilege(userRole: UserRole, privilege: string): boolean {
  if (!userRole || !privilege) return false;
  
  const rolePrivileges = rolePrivilegeMap[userRole] || [];
  
  // Wildcard check
  if (rolePrivileges.includes('*')) return true;
  
  // Exact match
  if (rolePrivileges.includes(privilege)) return true;
  
  // Category wildcard (e.g., "policies:*" matches "policies:view")
  const categoryWildcard = privilege.split(':')[0] + ':*';
  if (rolePrivileges.includes(categoryWildcard)) return true;
  
  return false;
}

// Check if a role has a privilege with context awareness
export function checkPrivilegeWithContext(
  userRole: UserRole, 
  privilege: string, 
  context: ResourceContext
): boolean {
  // For superAdmin, bypass all checks
  if (userRole === 'superAdmin' || userRole === 'super_admin') return true;
  
  // Check standard privileges first
  if (checkPrivilege(userRole, privilege)) return true;
  
  // Resource ownership check
  if (privilege.includes('.own:') && context.ownerId === context.currentUserId) {
    const basePrivilege = privilege.replace('.own:', ':');
    return checkPrivilege(userRole, basePrivilege);
  }
  
  // Company resource check
  if (privilege.includes('.company:') && context.companyId === context.currentUserCompanyId) {
    const basePrivilege = privilege.replace('.company:', ':');
    return checkPrivilege(userRole, basePrivilege);
  }
  
  return false;
}

// Fetch user's custom privileges from the database
export async function fetchUserCustomPrivileges(userId: string): Promise<CustomPrivilege[]> {
  // Mock implementation - replace with actual API call or database query
  const mockCustomPrivileges: CustomPrivilege[] = [
    {
      id: "cp1",
      user_id: userId,
      privilege: "reports.export:all",
      granted_at: new Date().toISOString(),
      granted_by: "admin1",
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    }
  ];
  
  return mockCustomPrivileges;
}
