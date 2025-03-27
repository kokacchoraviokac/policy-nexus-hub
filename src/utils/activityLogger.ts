
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type ActivityAction = "create" | "update" | "delete" | "view" | "export" | "import";

export type EntityType = "client" | "insurer" | "product" | "policy" | "claim" | "agent";

export interface LogActivityParams {
  entityType: EntityType;
  entityId: string;
  action: ActivityAction;
  details?: Record<string, any>;
  companyId?: string;
}

interface ActivityLogItem {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details?: string;
}

/**
 * Logs an activity to the activity_logs table
 */
export const logActivity = async (params: LogActivityParams): Promise<void> => {
  try {
    const { entityType, entityId, action, details = {}, companyId } = params;
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error("Cannot log activity: No authenticated user");
      return;
    }
    
    const userId = session.user.id;
    const userCompanyId = companyId || session.user.user_metadata?.company_id;
    
    if (!userCompanyId) {
      console.error("Cannot log activity: No company ID");
      return;
    }

    // Insert activity log using raw SQL query since the table might not be in TypeScript types yet
    const { error } = await supabase
      .rpc('log_activity', {
        p_entity_type: entityType,
        p_entity_id: entityId,
        p_action: action,
        p_details: details,
        p_company_id: userCompanyId,
        p_user_id: userId
      });

    if (error) {
      console.error("Error logging activity:", error);
    } else {
      console.log(`Activity logged: ${action} on ${entityType} ${entityId}`);
    }
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

/**
 * Hook to use activity logging in components
 */
export const useActivityLogger = () => {
  const { user } = useAuth();
  
  const logActivityWithUser = async (params: Omit<LogActivityParams, "companyId">) => {
    if (!user) {
      console.error("Cannot log activity: No authenticated user");
      return;
    }
    
    return logActivity({
      ...params,
      companyId: user.companyId
    });
  };
  
  return { logActivity: logActivityWithUser };
};

/**
 * Fetch activity logs for a specific entity
 */
export const fetchActivityLogs = async (entityType: EntityType, entityId: string): Promise<ActivityLogItem[]> => {
  try {
    // Use a stored procedure to get activity logs
    const { data, error } = await supabase
      .rpc('get_activity_logs', {
        p_entity_type: entityType,
        p_entity_id: entityId
      });
    
    if (error) {
      console.error("Error fetching activity logs:", error);
      toast.error("Failed to load activity history");
      return [];
    }
    
    // Transform the data into the expected format
    return data.map((log: any) => ({
      id: log.id,
      action: formatAction(log.action as ActivityAction),
      timestamp: log.created_at,
      user: log.user_name || 'Unknown user',
      details: formatDetails(log.action as ActivityAction, log.details)
    }));
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
    toast.error("Failed to load activity history");
    return [];
  }
};

// Helper to format action text for display
const formatAction = (action: ActivityAction): string => {
  const actionMap: Record<ActivityAction, string> = {
    create: "Created new record",
    update: "Updated record",
    delete: "Deleted record",
    view: "Viewed record",
    export: "Exported record",
    import: "Imported record"
  };
  
  return actionMap[action] || action;
};

// Helper to format details for display
const formatDetails = (action: ActivityAction, details?: Record<string, any>): string | undefined => {
  if (!details) return undefined;
  
  if (action === 'update' && details.changes) {
    const changes = details.changes;
    const changeText = Object.keys(changes)
      .map(field => `Changed ${field} from "${changes[field].old}" to "${changes[field].new}"`)
      .join(", ");
    return changeText;
  }
  
  if (action === 'create' && details.fields) {
    return `Created with ${Object.keys(details.fields).length} fields`;
  }
  
  return JSON.stringify(details);
};
