
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, CustomPrivilege } from "@/types/auth/userTypes";

export async function fetchUserCustomPrivileges(userId: string): Promise<CustomPrivilege[]> {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('user_custom_privileges')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching user privileges:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchUserCustomPrivileges:", error);
    return [];
  }
}

export async function grantCustomPrivilege(
  userId: string,
  privilege: string,
  grantedBy: string,
  expiresAt?: string
): Promise<CustomPrivilege | null> {
  try {
    const { data, error } = await supabase
      .from('user_custom_privileges')
      .insert({
        user_id: userId,
        privilege,
        granted_by: grantedBy,
        expires_at: expiresAt
      })
      .select()
      .single();

    if (error) {
      console.error("Error granting custom privilege:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in grantCustomPrivilege:", error);
    return null;
  }
}

export async function revokeCustomPrivilege(privilegeId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_custom_privileges')
      .delete()
      .eq('id', privilegeId);

    if (error) {
      console.error("Error revoking custom privilege:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in revokeCustomPrivilege:", error);
    return false;
  }
}

export function isValidPrivilege(privilege: CustomPrivilege): boolean {
  // Check if privilege has expired
  if (privilege.expires_at) {
    const expiryDate = new Date(privilege.expires_at);
    if (expiryDate < new Date()) {
      return false;
    }
  }
  return true;
}

export function handleApiError(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'An unknown error occurred';
}

export function getErrorMessage(error: any): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'An unknown error occurred';
}
