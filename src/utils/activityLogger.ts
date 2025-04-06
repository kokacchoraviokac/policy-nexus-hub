import { EntityType } from '@/types/common';
import { supabase } from "@/integrations/supabase/client";

// Use EntityType from common
export type { EntityType };

export interface ActivityLog {
  entity_type: EntityType;
  entity_id: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export';
  details?: any;
}

export const useActivityLogger = () => {
  const logActivity = async (activity: ActivityLog) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Cannot log activity: No authenticated user");
        return;
      }
      
      // Insert activity log
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          entity_type: activity.entity_type,
          entity_id: activity.entity_id,
          action: activity.action,
          details: activity.details || {},
          user_id: user.id,
          company_id: user.user_metadata?.company_id
        });
      
      if (error) {
        console.error("Error logging activity:", error);
      }
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };
  
  return { logActivity };
};

// Add the fetchActivityLogs function
export interface ActivityLogRecord {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  userEmail?: string;
  details?: any;
}

export const fetchActivityLogs = async (entityType: string, entityId: string): Promise<ActivityLogRecord[]> => {
  try {
    // Fetch activity logs
    const { data: logs, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Fetch user profiles for user information
    const userIds = logs.map(log => log.user_id).filter(Boolean);
    let userProfiles: any = {};
    
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);
      
      if (!profilesError && profiles) {
        userProfiles = profiles.reduce((acc: any, profile: any) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
      }
    }
    
    // Transform logs to required format
    return logs.map(log => ({
      id: log.id,
      action: log.action,
      timestamp: log.created_at,
      user: userProfiles[log.user_id]?.name || 'Unknown User',
      userEmail: userProfiles[log.user_id]?.email,
      details: log.details
    }));
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
};
