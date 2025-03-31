
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
    // First fetch the activity logs
    const { data: logData, error: logError } = await supabase
      .from('activity_logs')
      .select(`
        id,
        action,
        created_at,
        details,
        user_id
      `)
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .order('created_at', { ascending: false });
    
    if (logError) throw logError;
    
    // Get user profiles separately since the join doesn't work
    const userIds = logData.map(log => log.user_id).filter(Boolean);
    let userProfiles = {};
    
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);
      
      if (!profilesError && profiles) {
        userProfiles = profiles.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
      }
    }
    
    // Transform data to include user names
    return logData.map(log => ({
      id: log.id,
      action: log.action,
      timestamp: log.created_at,
      user: userProfiles[log.user_id]?.name || 'Unknown user',
      userEmail: userProfiles[log.user_id]?.email,
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
        company_id: user.companyId
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
