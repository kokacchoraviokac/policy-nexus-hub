
import { UserRole } from "@/types/auth/userTypes";

// Default privileges by role - these are used when no custom privileges are set
const DEFAULT_PRIVILEGES_BY_ROLE: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: [
    "read:all",
    "write:all",
    "delete:all",
    "manage:users",
    "manage:settings",
  ],
  [UserRole.SUPER_ADMIN]: [
    "read:all",
    "write:all",
    "delete:all",
    "manage:users",
    "manage:companies",
    "manage:settings",
    "system:admin",
  ],
  [UserRole.EMPLOYEE]: [
    "read:policies",
    "write:policies",
    "read:clients",
    "write:clients",
    "read:claims",
    "write:claims",
  ],
  [UserRole.AGENT]: [
    "read:policies",
    "read:clients",
    "write:clients",
    "read:commissions",
  ],
  [UserRole.CLIENT]: [
    "read:own_policies",
    "read:own_claims",
    "write:own_claims",
  ],
};

/**
 * Check if a user role has a specific privilege by default
 * @param role User role to check
 * @param privilege Privilege string to check
 * @returns boolean indicating if the role has the privilege
 */
export function roleHasPrivilege(role: UserRole, privilege: string): boolean {
  // Admin roles have all privileges by default
  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Check if the role's default privileges include the requested privilege
  const rolePrivileges = DEFAULT_PRIVILEGES_BY_ROLE[role] || [];
  return rolePrivileges.includes(privilege);
}

/**
 * Get all default privileges for a specific role
 * @param role User role
 * @returns Array of privilege strings
 */
export function getDefaultPrivilegesForRole(role: UserRole): string[] {
  return DEFAULT_PRIVILEGES_BY_ROLE[role] || [];
}

/**
 * Check if a user can access a particular resource based on role
 * @param resource Resource string (e.g., "policies", "claims")
 * @param action Action string (e.g., "read", "write", "delete")
 * @param userRole User's role
 * @returns boolean indicating if the user can access the resource
 */
export function canAccessResource(
  resource: string,
  action: string,
  userRole: UserRole
): boolean {
  // Admins can access everything
  if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
    return true;
  }

  const privilege = `${action}:${resource}`;
  return roleHasPrivilege(userRole, privilege);
}
