
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Users } from "lucide-react";

const PolicyStatistics: React.FC = () => {
  const { t } = useLanguage();
  
  // Query for active policies count
  const { data: activePoliciesCount } = useQuery({
    queryKey: ['policies-count-active'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('policies')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      if (error) throw error;
      return count || 0;
    }
  });
  
  // Query for upcoming renewals (policies expiring in the next 40 days)
  const { data: upcomingRenewalsCount } = useQuery({
    queryKey: ['policies-upcoming-renewals'],
    queryFn: async () => {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 40);
      
      const todayStr = today.toISOString().split('T')[0];
      const futureDateStr = futureDate.toISOString().split('T')[0];
      
      const { count, error } = await supabase
        .from('policies')
        .select('*', { count: 'exact', head: true })
        .gte('expiry_date', todayStr)
        .lte('expiry_date', futureDateStr);
      
      if (error) throw error;
      return count || 0;
    }
  });
  
  // Query for unassigned policies
  const { data: unassignedPoliciesCount } = useQuery({
    queryKey: ['policies-unassigned'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('policies')
        .select('*', { count: 'exact', head: true })
        .is('assigned_to', null);
      
      if (error) throw error;
      return count || 0;
    }
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-primary" />
            {t("upcomingRenewals")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{upcomingRenewalsCount || 0}</p>
          <p className="text-xs text-muted-foreground">{t("nextDays")}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <FileText className="mr-2 h-4 w-4 text-primary" />
            {t("activePolicies")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{activePoliciesCount || 0}</p>
          <p className="text-xs text-muted-foreground">{t("acrossClients")}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="mr-2 h-4 w-4 text-primary" />
            {t("unassignedPolicies")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{unassignedPoliciesCount || 0}</p>
          <p className="text-xs text-muted-foreground">{t("needAttention")}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyStatistics;
