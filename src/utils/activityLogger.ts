
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type ActivityAction = 
  "create" | "update" | "delete" | "view" | "export" | "import" | 
  "document_uploaded" | "document_deleted" | "document_download";

export type EntityType = 
  "client" | "insurer" | "product" | "policy" | "claim" | "agent" | 
  "sales_process";

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

    // Insert directly into the activity_logs table we created
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        entity_type: entityType,
        entity_id: entityId,
        action,
        details,
        company_id: userCompanyId,
        user_id: userId
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
    // Query the activity_logs table directly
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        id,
        action,
        created_at,
        user_id,
        details
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching activity logs:", error);
      toast.error("Failed to load activity history");
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Get user names for all user_ids
    const userIds = data.map(log => log.user_id).filter(Boolean);
    let userNames: Record<string, string> = {};
    
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);
        
      if (profiles) {
        userNames = profiles.reduce((acc, profile) => {
          acc[profile.id] = profile.name;
          return acc;
        }, {} as Record<string, string>);
      }
    }
    
    // Transform the data into the expected format
    return data.map((log) => ({
      id: log.id,
      action: formatAction(log.action as ActivityAction),
      timestamp: log.created_at,
      user: userNames[log.user_id] || 'Unknown user',
      details: formatDetails(log.action as ActivityAction, 
        // Make sure we parse the details if it's a string, or use it directly if it's already an object
        typeof log.details === 'string' 
          ? JSON.parse(log.details) 
          : log.details as Record<string, any> | undefined
      )
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
    import: "Imported record",
    document_uploaded: "Uploaded document",
    document_deleted: "Deleted document",
    document_download: "Downloaded document"
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
  
  // Handle document-related actions
  if (action === 'update' && details.action_type) {
    if (details.action_type === 'document_uploaded') {
      return `Uploaded document: ${details.document_name}`;
    }
    if (details.action_type === 'document_deleted') {
      return `Deleted document: ${details.document_name}`;
    }
    if (details.action_type === 'document_download') {
      return `Downloaded document: ${details.document_name}`;
    }
  }
  
  if (action === 'create' && details.fields) {
    return `Created with ${Object.keys(details.fields).length} fields`;
  }
  
  return JSON.stringify(details);
};
