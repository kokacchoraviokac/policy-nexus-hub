
import { UserRole } from "./user";

// Define privileges for each role
export const rolePrivileges: Record<UserRole, string[]> = {
  superAdmin: ["*"], // Superadmin has all privileges
  admin: [
    "dashboard:view",
    "policies:view", "policies:create", "policies:edit", "policies:delete",
    "claims:view", "claims:create", "claims:edit", "claims:delete",
    "finances:view", "finances:create", "finances:edit", "finances:delete",
    "codebook:view", "codebook:create", "codebook:edit", "codebook:delete",
    "agent:view", "agent:create", "agent:edit", "agent:delete",
    "reports:view", "reports:create", "reports:edit", "reports:delete",
    "settings:view", "settings:edit",
    "users:view", "users:invite", "users:edit",
    "sales:view", "sales:create", "sales:edit", "sales:delete" // Add sales privileges
  ],
  employee: [
    "dashboard:view",
    "policies:view", "policies:create", "policies:edit",
    "claims:view", "claims:create",
    "reports:view",
    "sales:view", "sales:create", "sales:edit" // Add sales privileges with restricted permissions
  ]
};

// Get all privileges for a role
export function getRolePrivileges(role: UserRole): string[] {
  return rolePrivileges[role] || [];
}
