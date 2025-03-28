
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityLog } from "@/components/codebook/details/ActivityLog";

interface PolicyHistoryTabProps {
  policyId: string;
}

interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details?: string;
}

const PolicyHistoryTab: React.FC<PolicyHistoryTabProps> = ({ policyId }) => {
  const { t } = useLanguage();

  const { data: activityLogs, isLoading, isError, refetch } = useQuery({
    queryKey: ['policy-history', policyId],
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

      // Get user names for all user IDs
      const userIds = data.map(log => log.user_id).filter(Boolean);
      let userNames: Record<string, string> = {};
      
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);
          
        if (!profilesError && profiles) {
          userNames = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile.name;
            return acc;
          }, {} as Record<string, string>);
        }
      }

      // Map to ActivityItem format
      return data.map(log => ({
        id: log.id,
        action: log.action,
        timestamp: log.created_at,
        user: userNames[log.user_id] || t("unknownUser"),
        details: log.details ? JSON.stringify(log.details) : undefined
      })) as ActivityItem[];
    },
  });

  if (isError) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center py-6">
            <h3 className="text-lg font-medium text-destructive">{t("errorLoadingHistory")}</h3>
            <p className="text-muted-foreground mt-2">{t("tryRefreshingPage")}</p>
            <Button className="mt-4" onClick={() => refetch()}>
              {t("refresh")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-6">{t("policyActivityHistory")}</h3>
        <ActivityLog items={activityLogs || []} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default PolicyHistoryTab;
