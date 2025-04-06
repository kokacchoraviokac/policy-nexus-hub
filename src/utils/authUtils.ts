
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth/userTypes";
import { CustomPrivilege } from "@/types/auth/userTypes";

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
