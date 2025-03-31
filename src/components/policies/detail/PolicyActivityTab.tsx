
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Activity, UserCircle, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface PolicyActivityTabProps {
  policyId: string;
}

const PolicyActivityTab: React.FC<PolicyActivityTabProps> = ({ policyId }) => {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  
  const { data: activities, isLoading } = useQuery({
    queryKey: ['policy-activities', policyId],
    queryFn: async () => {
      // First, fetch the activity logs
      const { data: logs, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('entity_id', policyId)
        .eq('entity_type', 'policy')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get user profiles separately
      const userIds = logs.map(log => log.user_id).filter(Boolean);
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
      
      // Combine the data
      return logs.map(log => ({
        ...log,
        profiles: userProfiles[log.user_id] || { name: 'Unknown user' }
      }));
    },
    enabled: !!policyId
  });
  
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Activity className="h-5 w-5" />;
      case 'update':
        return <Activity className="h-5 w-5" />;
      case 'delete':
        return <Activity className="h-5 w-5" />;
      case 'view':
        return <Activity className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };
  
  const getActivityTitle = (activity: any) => {
    // Safely access the profiles property, which might be null or undefined
    const userName = activity.profiles?.name || 'Unknown user';
    
    switch (activity.action) {
      case 'create':
        return t("policyCreated", { user: userName });
      case 'update':
        return t("policyUpdated", { user: userName });
      case 'delete':
        return t("policyDeleted", { user: userName });
      case 'view':
        return t("policyViewed", { user: userName });
      default:
        return t("policyAction", { action: activity.action, user: userName });
    }
  };
  
  const displayedActivities = showAll ? activities : activities?.slice(0, 5);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("activityHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">{t("noActivityRecorded")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("activityWillAppearHere")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("activityHistory")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayedActivities?.map((activity, index) => (
            <div key={activity.id} className="relative">
              <div className="flex items-start space-x-4">
                <div className="bg-muted rounded-full p-2">
                  {getActivityIcon(activity.action)}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">{getActivityTitle(activity)}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <UserCircle className="h-4 w-4" />
                    <span>{activity.profiles?.name || 'Unknown user'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(activity.created_at), 'PPP')}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{format(new Date(activity.created_at), 'p')}</span>
                    <span className="text-muted-foreground">
                      ({formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })})
                    </span>
                  </div>
                  
                  {activity.details && (
                    <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                      <pre className="whitespace-pre-wrap font-mono text-xs">
                        {JSON.stringify(activity.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              
              {index < displayedActivities.length - 1 && (
                <div className="absolute left-4 top-12 bottom-0 w-px bg-muted-foreground/20"></div>
              )}
              
              {index < displayedActivities.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
          
          {activities.length > 5 && !showAll && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setShowAll(true)}
            >
              {t("showAllActivity", { count: activities.length })}
            </Button>
          )}
          
          {showAll && activities.length > 5 && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setShowAll(false)}
            >
              {t("showLessActivity")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyActivityTab;
