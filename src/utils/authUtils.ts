
import { supabase } from "@/integrations/supabase/client";
import { ResourceContext } from "@/types/auth/contextTypes";
import { fromTable } from "./supabaseQueryHelper";

/**
 * Check if a user has a specific privilege with context
 */
export async function checkPrivilegeWithContext(
  userId: string,
  privilege: string,
  context?: ResourceContext
): Promise<boolean> {
  if (!userId || !privilege) {
    return false;
  }

  try {
    // Query for direct user privileges
    const { data: userPrivileges, error } = await supabase
      .from('user_custom_privileges')
      .select('*')
      .eq('user_id', userId)
      .eq('privilege', privilege);

    if (error) {
      console.error('Error checking user privileges:', error);
      return false;
    }

    // No privileges found
    if (!userPrivileges || userPrivileges.length === 0) {
      return false;
    }

    // If no context is provided, the user has the privilege
    if (!context) {
      return true;
    }

    // Check if any privilege matches the context
    for (const userPrivilege of userPrivileges) {
      // If privilege has no specific context, it applies to all
      if (!userPrivilege.context) {
        return true;
      }

      // Check owner context
      if (context.ownerId && userPrivilege.context.ownerId) {
        if (userPrivilege.context.ownerId !== context.ownerId) {
          continue;
        }
      }

      // Check user ID context
      if (context.currentUserId && userPrivilege.context.currentUserId) {
        if (userPrivilege.context.currentUserId !== context.currentUserId) {
          continue;
        }
      }

      // Check company context
      if (context.companyId && userPrivilege.context.companyId) {
        if (userPrivilege.context.companyId !== context.companyId) {
          continue;
        }
      }

      // Check user company context
      if (context.currentUserCompanyId && userPrivilege.context.currentUserCompanyId) {
        if (userPrivilege.context.currentUserCompanyId !== context.currentUserCompanyId) {
          continue;
        }
      }

      // Check resource type
      if (context.resourceType && userPrivilege.context.resourceType) {
        if (userPrivilege.context.resourceType !== context.resourceType) {
          continue;
        }
      }

      // If all checks passed, user has the privilege
      return true;
    }

    // No matching context found
    return false;
  } catch (error) {
    console.error('Error checking privilege with context:', error);
    return false;
  }
}

/**
 * Check if a user has a specific privilege
 */
export async function checkPrivilege(userId: string, privilege: string): Promise<boolean> {
  return checkPrivilegeWithContext(userId, privilege);
}

/**
 * Fetch custom privileges for a user
 */
export async function fetchUserCustomPrivileges(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_custom_privileges')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user privileges:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchUserCustomPrivileges:', error);
    return [];
  }
}

/**
 * Grant a custom privilege to a user
 */
export async function grantCustomPrivilege(
  userId: string,
  privilege: string,
  grantedBy: string,
  expiresAt?: Date,
  context?: Record<string, any>
) {
  try {
    const { data, error } = await fromTable('user_custom_privileges')
      .insert({
        user_id: userId,
        privilege,
        granted_by: grantedBy,
        granted_at: new Date().toISOString(),
        expires_at: expiresAt ? expiresAt.toISOString() : null,
        context: context ? JSON.stringify(context) : null
      })
      .select();

    if (error) {
      console.error('Error granting privilege:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in grantCustomPrivilege:', error);
    return false;
  }
}

/**
 * Revoke a custom privilege
 */
export async function revokeCustomPrivilege(privilegeId: string) {
  try {
    const { error } = await fromTable('user_custom_privileges')
      .delete()
      .eq('id', privilegeId);

    if (error) {
      console.error('Error revoking privilege:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in revokeCustomPrivilege:', error);
    return false;
  }
}
