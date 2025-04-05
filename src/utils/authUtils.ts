
import { supabase } from '@/integrations/supabase/client';
import { CustomPrivilege } from '@/types/auth/user';
import { ResourceContext } from '@/types/auth/contextTypes';

// Grant a custom privilege to a user
export async function grantCustomPrivilege(
  userId: string,
  privilege: string,
  grantedBy: string,
  expiresAt?: Date
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_custom_privileges')
      .insert({
        user_id: userId,
        privilege: privilege,
        granted_by: grantedBy,
        expires_at: expiresAt ? expiresAt.toISOString() : null
      })
      .select()
      .single();

    if (error) {
      console.error('Error granting privilege:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error granting privilege:', error);
    return false;
  }
}

// Revoke a custom privilege
export async function revokeCustomPrivilege(privilegeId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_custom_privileges')
      .delete()
      .eq('id', privilegeId);

    if (error) {
      console.error('Error revoking privilege:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error revoking privilege:', error);
    return false;
  }
}

// Fetch custom privileges for a specific user
export async function fetchUserCustomPrivileges(userId: string): Promise<CustomPrivilege[]> {
  try {
    const { data, error } = await supabase
      .from('user_custom_privileges')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user privileges:', error);
      return [];
    }

    return data as CustomPrivilege[];
  } catch (error) {
    console.error('Unexpected error fetching user privileges:', error);
    return [];
  }
}

// Check if a user has a specific privilege
export function checkPrivilege(
  userPrivileges: string[],
  privilege: string
): boolean {
  return userPrivileges.includes(privilege);
}

// Check if a user has a specific privilege with context
export function checkPrivilegeWithContext(
  userPrivileges: string[],
  privilege: string,
  context?: ResourceContext
): boolean {
  // Simple check without context
  if (!context) {
    return checkPrivilege(userPrivileges, privilege);
  }
  
  // Check for ownership-based privileges
  if (context.ownerId && context.currentUserId) {
    // If the user is the owner of the resource, they have full access
    if (context.ownerId === context.currentUserId) {
      return true;
    }
  }
  
  // Check for company-based privileges
  if (context.companyId && context.currentUserCompanyId) {
    // If the user is from the same company, check for the company-specific privilege
    if (context.companyId === context.currentUserCompanyId) {
      return checkPrivilege(userPrivileges, `${privilege}:company`);
    }
  }
  
  // Default check
  return checkPrivilege(userPrivileges, privilege);
}
