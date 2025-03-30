
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PolicyActivityTabProps {
  policyId: string;
}

const PolicyActivityTab: React.FC<PolicyActivityTabProps> = ({ policyId }) => {
  const { t, formatDate } = useLanguage();
  
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['policy-activity', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          id,
          action,
          created_at,
          details,
          user_id
        `)
        .eq('entity_id', policyId)
        .eq('entity_type', 'policy')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
  
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">{t("activityHistory")}</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <h3 className="font-semibold">{t("errorLoadingActivity")}</h3>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : t("unknownError")}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">{t("activityHistory")}</h2>
      
      {activities && activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity: any) => (
            <Card key={activity.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    {getActivityIcon(activity.action)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{formatActivityAction(activity.action, t)}</h3>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-sm mt-1">
                      {activity.details ? 
                        typeof activity.details === 'object' ? 
                          JSON.stringify(activity.details) : 
                          activity.details
                        : ''}
                    </p>
                    
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      <span>{activity.user_id || t("system")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/40 rounded-lg">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">{t("noActivityRecorded")}</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            {t("noActivityRecordedDescription")}
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to get the appropriate icon based on action type
const getActivityIcon = (action: string) => {
  switch (action.toLowerCase()) {
    case 'view':
      return <User className="h-4 w-4 text-primary" />;
    case 'update':
    case 'edit':
      return <FileText className="h-4 w-4 text-primary" />;
    default:
      return <Clock className="h-4 w-4 text-primary" />;
  }
};

// Helper function to format the action for display
const formatActivityAction = (action: string, t: (key: string) => string) => {
  return t(`activity.${action.toLowerCase()}`) || action;
};

export default PolicyActivityTab;
