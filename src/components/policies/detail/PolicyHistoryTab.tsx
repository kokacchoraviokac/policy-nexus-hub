
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityLog } from "@/components/codebook/details/ActivityLog";
import { fetchActivityLogs, ActivityLog as ActivityLogType } from "@/utils/activityLogger";

interface PolicyHistoryTabProps {
  policyId: string;
}

// Define the ActivityItem type to match what the ActivityLog component expects
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
      const logs = await fetchActivityLogs("policy", policyId);
      
      // Transform data for the ActivityLog component
      return logs.map(log => ({
        id: log.id,
        action: log.action,
        timestamp: log.timestamp,
        user: log.user,
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
