
import React from "react";
import { FileText, TrendingUp, ClipboardCheck, DollarSign, Calendar, AlertTriangle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ListCard from "@/components/dashboard/ListCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useDashboardKPIs,
  useUpcomingPolicies,
  useIncompletePolicies,
  useOpenClaims,
  useSalesPipelineData
} from "@/hooks/useDashboardData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch real data from Supabase
  const { data: kpis, isLoading: kpisLoading, error: kpisError } = useDashboardKPIs();
  const { data: upcomingPoliciesData, isLoading: upcomingLoading } = useUpcomingPolicies();
  const { data: incompletePoliciesData, isLoading: incompleteLoading } = useIncompletePolicies();
  const { data: openClaimsData, isLoading: claimsLoading } = useOpenClaims();
  const { data: salesPipelineData, isLoading: pipelineLoading } = useSalesPipelineData();

  // Log dashboard access for audit trail
  React.useEffect(() => {
    const logDashboardAccess = async () => {
      if (!user) return;

      try {
        // Get user's company ID from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();

        if (profile?.company_id) {
          await supabase.from('activity_logs').insert({
            user_id: user.id,
            action: 'dashboard_access',
            entity_type: 'dashboard',
            entity_id: 'main_dashboard',
            company_id: profile.company_id,
            details: { accessed_at: new Date().toISOString() }
          });
          console.log('Dashboard access logged');
        }
      } catch (error) {
        console.error('Failed to log dashboard access:', error);
      }
    };

    logDashboardAccess();
  }, [user]);

  // Transform data for the UI components
  const upcomingPolicies = upcomingPoliciesData?.map(policy => ({
    id: policy.id,
    primary: `${policy.insurer_name} - ${policy.policyholder_name}`,
    secondary: `Policy #${policy.policy_number}`,
    tertiary: formatDate(policy.expiry_date),
    status: "warning" as const,
    tooltipContent: `Policy expires on ${formatDate(policy.expiry_date)}. Premium: ${formatCurrency(policy.premium, policy.currency)}`
  })) || [];

  const incompletePolicies = incompletePoliciesData?.map(policy => ({
    id: policy.id,
    primary: `${policy.insurer_name || 'Unknown Insurer'} - ${(policy as any).policyholder_name || 'Unknown Policyholder'}`,
    secondary: `Missing: ${policy.missing_fields.join(', ')}`,
    tertiary: formatDate(policy.created_at, 'relative'),
    status: "error" as const,
    tooltipContent: `Policy missing required fields: ${policy.missing_fields.join(', ')}`
  })) || [];

  const openClaims = openClaimsData?.map(claim => ({
    id: claim.id,
    primary: `Claim #${claim.claim_number}`,
    secondary: `Policy #${claim.policy_number}`,
    tertiary: formatCurrency(claim.claimed_amount),
    status: claim.status === 'accepted' ? "success" as const :
           claim.status === 'rejected' ? "error" as const : "warning" as const,
    tooltipContent: `Incident date: ${formatDate(claim.incident_date)}. Status: ${claim.status}`
  })) || [];

  // Handle loading and error states
  if (kpisLoading || upcomingLoading || incompleteLoading || claimsLoading || pipelineLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{t("loadingDashboard")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (kpisError) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">{t("errorLoadingDashboard")}</h2>
            <p className="text-muted-foreground">{t("tryRefreshingPage")}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleCardClick = (destination: string, title: string) => {
    toast.info(`Navigating to ${title}`, {
      description: `Loading ${title.toLowerCase()} details...`,
    });
    navigate(destination);
  };

  const handlePolicyClick = (id: string) => {
    toast.info(`Opening policy details`, {
      description: `Loading details for policy #${id}...`,
    });
    // In a real app, this would navigate to the specific policy
    navigate(`/policies?id=${id}`);
  };

  const handleClaimClick = (id: string) => {
    toast.info(`Opening claim details`, {
      description: `Loading details for claim #${id}...`,
    });
    // In a real app, this would navigate to the specific claim
    navigate(`/claims?id=${id}`);
  };

  const handleRefresh = async () => {
    toast.info(t("refreshingData") || "Refreshing data", {
      description: t("updatingDashboardData") || "Updating dashboard data...",
    });

    // Invalidate all dashboard-related queries
    queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
    queryClient.invalidateQueries({ queryKey: ['upcoming-policies'] });
    queryClient.invalidateQueries({ queryKey: ['incomplete-policies'] });
    queryClient.invalidateQueries({ queryKey: ['open-claims'] });
    queryClient.invalidateQueries({ queryKey: ['sales-pipeline-data'] });

    // Log refresh action
    if (user) {
      try {
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          action: 'dashboard_refresh',
          entity_type: 'dashboard',
          entity_id: 'main_dashboard',
          company_id: '', // Will be set by RLS
          details: { refreshed_at: new Date().toISOString() }
        });
      } catch (error) {
        console.error('Failed to log dashboard refresh:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("todayOverview")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {t("refresh") || "Refresh"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("totalPolicies")}
          value={kpis?.totalPolicies.toString() || "0"}
          icon={<FileText className="h-5 w-5 text-primary" />}
          trend={{ value: 12, positive: true }}
          tooltipContent={`Total active policies across all clients. ${kpis?.totalPolicies || 0} policies currently managed.`}
          onClick={() => handleCardClick("/policies", "Policies")}
        />
        <StatCard
          title={t("salesPipeline")}
          value={formatCurrency(salesPipelineData?.totalLeads || 0)}
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
          trend={{ value: Math.round(salesPipelineData?.conversionRate || 0), positive: true }}
          tooltipContent={`Total leads in pipeline: ${salesPipelineData?.totalLeads || 0}. Conversion rate: ${Math.round(salesPipelineData?.conversionRate || 0)}%`}
          onClick={() => handleCardClick("/sales/pipeline-overview", "Sales Pipeline")}
        />
        <StatCard
          title={t("openClaims")}
          value={kpis?.openClaims.toString() || "0"}
          icon={<ClipboardCheck className="h-5 w-5 text-primary" />}
          trend={{ value: 3, positive: false }}
          tooltipContent={`Total unresolved claims requiring attention. ${kpis?.openClaims || 0} claims currently open.`}
          onClick={() => handleCardClick("/claims", "Claims")}
        />
        <StatCard
          title={t("monthlyRevenue")}
          value={formatCurrency(kpis?.monthlyRevenue || 0)}
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          trend={{ value: 5, positive: true }}
          tooltipContent={`Total revenue for the current month from commissions and fees. ${formatCurrency(kpis?.monthlyRevenue || 0)} earned this month.`}
          onClick={() => handleCardClick("/finances", "Finances")}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ListCard 
          title={t("upcomingPolicies")} 
          items={upcomingPolicies} 
          icon={<Calendar className="h-5 w-5" />}
          onItemClick={handlePolicyClick}
          actionLabel={t("viewAll")}
          onAction={() => handleCardClick("/policies", "All Policies")}
        />
        
        <ListCard 
          title={t("incompletePolicies")} 
          items={incompletePolicies} 
          icon={<AlertTriangle className="h-5 w-5" />}
          onItemClick={handlePolicyClick}
          actionLabel={t("processAll")}
          onAction={() => handleCardClick("/policies/workflow", "Policy Workflow")}
        />
        
        <ListCard 
          title={t("openClaims")} 
          items={openClaims} 
          icon={<ClipboardCheck className="h-5 w-5" />}
          onItemClick={handleClaimClick}
          actionLabel={t("viewAll")}
          onAction={() => handleCardClick("/claims", "All Claims")}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20">
          <CardHeader>
            <CardTitle>{t("salesPipelineOverview")}</CardTitle>
            <CardDescription>{t("currentLeadsByStage")}</CardDescription>
          </CardHeader>
          <CardContent
            className="h-[200px] flex items-center justify-center cursor-pointer"
            onClick={() => handleCardClick("/sales/pipeline-overview", "Sales Pipeline")}
          >
            <div className="relative w-full h-full bg-secondary/30 rounded-md overflow-hidden">
              <div className="absolute bottom-0 left-0 w-1/4 h-[70%] bg-primary/20 rounded-t-md"></div>
              <div className="absolute bottom-0 left-1/4 w-1/4 h-[50%] bg-primary/30 rounded-t-md"></div>
              <div className="absolute bottom-0 left-2/4 w-1/4 h-[35%] bg-primary/40 rounded-t-md"></div>
              <div className="absolute bottom-0 left-3/4 w-1/4 h-[20%] bg-primary/50 rounded-t-md"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-sm">
                <div className="text-center space-y-1">
                  <div className="font-medium">{salesPipelineData?.totalLeads || 0} {t("totalLeads")}</div>
                  <div className="text-xs text-muted-foreground">
                    {salesPipelineData?.qualifiedLeads || 0} {t("qualified")}, {Math.round(salesPipelineData?.conversionRate || 0)}% {t("conversionRate")}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20">
          <CardHeader>
            <CardTitle>{t("readyToInputPolicies")}</CardTitle>
            <CardDescription>{t("policiesWithCompleteData")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incompletePolicies.length > 0 ? (
                <>
                  {incompletePolicies.slice(0, 2).map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md transition-all duration-200 hover:bg-secondary/50 cursor-pointer"
                      onClick={() => handlePolicyClick(policy.id)}
                    >
                      <div>
                        <p className="font-medium">{policy.primary}</p>
                        <p className="text-xs text-muted-foreground">{policy.secondary}</p>
                      </div>
                      <button className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md transition-colors">
                        {t("finalize")}
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center justify-center">
                    <button
                      className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                      onClick={() => handleCardClick("/policies/workflow", "Policy Workflow")}
                    >
                      {t("viewAllReadyPolicies")}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">{t("noIncompletePolicies")}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
