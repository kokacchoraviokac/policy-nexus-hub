
import { UserRole } from "@/types/auth/userTypes";

// Define role-based privileges
export const ROLE_PRIVILEGES: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: [
    // All admin privileges plus these
    "manage.system.settings",
    "view.all.companies",
    "manage.all.companies",
    "manage.super.admin.permissions"
  ],
  [UserRole.ADMIN]: [
    // Company admin privileges
    "manage.company.settings",
    "manage.users",
    "manage.roles",
    "view.all.policies",
    "manage.all.policies",
    "view.all.claims",
    "manage.all.claims",
    "view.reports",
    "export.data",
    "manage.templates"
  ],
  [UserRole.EMPLOYEE]: [
    // Regular employee privileges
    "view.assigned.policies",
    "manage.assigned.policies",
    "view.assigned.claims",
    "manage.assigned.claims"
  ],
  [UserRole.AGENT]: [
    // Agent privileges
    "view.own.policies",
    "view.own.commissions",
    "manage.own.profile"
  ],
  [UserRole.CLIENT]: [
    // Client privileges
    "view.own.policies",
    "view.own.claims",
    "submit.claim"
  ],
  [UserRole.USER]: [
    // Basic user privileges
    "view.own.profile",
    "manage.own.profile"
  ]
};

/**
 * Check if a specific role has a certain privilege
 */
export function hasRolePrivilege(role: UserRole, privilege: string): boolean {
  const privileges = ROLE_PRIVILEGES[role] || [];
  
  // Check for exact privilege match
  if (privileges.includes(privilege)) {
    return true;
  }
  
  // Check for wildcard privileges (e.g., "manage.*" matches "manage.users")
  const wildcardPrivileges = privileges.filter(p => p.endsWith('.*'));
  for (const wildcardPrivilege of wildcardPrivileges) {
    const prefix = wildcardPrivilege.replace('.*', '');
    if (privilege.startsWith(prefix)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get all privileges for a role
 */
export function getRolePrivileges(role: UserRole): string[] {
  return ROLE_PRIVILEGES[role] || [];
}

/**
 * Check if a role has higher privileges than another role
 */
export function isRoleHigherThan(role: UserRole, thanRole: UserRole): boolean {
  const roleOrder = [
    UserRole.CLIENT,
    UserRole.USER,
    UserRole.AGENT,
    UserRole.EMPLOYEE,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN
  ];
  
  const roleIndex = roleOrder.indexOf(role);
  const thanRoleIndex = roleOrder.indexOf(thanRole);
  
  return roleIndex > thanRoleIndex;
}
