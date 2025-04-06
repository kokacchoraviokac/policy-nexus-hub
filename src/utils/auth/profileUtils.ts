
import { UserRole } from '@/types/auth';

/**
 * Check if a user has admin privileges (either admin or superAdmin)
 */
export function isAdmin(role?: string | null) {
  return role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
}

/**
 * Check if a user is a super admin
 */
export function isSuperAdmin(role?: string | null) {
  return role === UserRole.SUPER_ADMIN;
}

/**
 * Get a readable role label
 */
export function getRoleBadgeLabel(role?: string | null) {
  const roleLabels: Record<string, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.EMPLOYEE]: 'Employee',
    [UserRole.AGENT]: 'Agent',
    [UserRole.CLIENT]: 'Client',
  };
  
  return role ? (roleLabels[role] || role) : 'Unknown';
}

/**
 * Get color class for role badge
 */
export function getRoleBadgeColor(role?: string | null) {
  const roleColors: Record<string, string> = {
    [UserRole.SUPER_ADMIN]: 'bg-purple-100 text-purple-800',
    [UserRole.ADMIN]: 'bg-blue-100 text-blue-800',
    [UserRole.EMPLOYEE]: 'bg-green-100 text-green-800',
    [UserRole.AGENT]: 'bg-amber-100 text-amber-800',
    [UserRole.CLIENT]: 'bg-slate-100 text-slate-800',
  };
  
  return role ? (roleColors[role] || 'bg-gray-100 text-gray-800') : 'bg-gray-100 text-gray-800';
}
