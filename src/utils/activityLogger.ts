
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";

// Define EntityType as a type to be used across the application
export type EntityType = "policy" | "claim" | "client" | "insurer" | "sales_process" | "agent" | "policy_addendum" | "product";

interface ActivityLogData {
  entityType: EntityType;
  entityId: string;
  action: string;
  details?: Record<string, any>;
}

// Function to fetch activity logs for a given entity
export const fetchActivityLogs = async (entityType: EntityType, entityId: string) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        id,
        action,
        created_at,
        details,
        user_id,
        profiles(
          name,
          email
        )
      `)
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform data to include user names
    return data.map(log => ({
      id: log.id,
      action: log.action,
      timestamp: log.created_at,
      user: log.profiles?.name || 'Unknown user',
      userEmail: log.profiles?.email,
      details: log.details
    }));
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    return [];
  }
};

export const useActivityLogger = () => {
  const { user } = useAuth();
  
  const logActivity = useCallback(async (data: ActivityLogData) => {
    try {
      if (!user) {
        console.warn("Activity logging skipped: No authenticated user");
        return;
      }
      
      const { error } = await supabase.from('activity_logs').insert({
        entity_type: data.entityType,
        entity_id: data.entityId,
        action: data.action,
        details: data.details || {},
        user_id: user.id,
        company_id: user.companyId // Fixed property name
      });
      
      if (error) {
        console.error("Failed to log activity:", error);
      }
    } catch (err) {
      console.error("Error in activity logging:", err);
    }
  }, [user]);
  
  return { logActivity };
};
