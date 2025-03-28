
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, FileDown, Repeat } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import PolicyDetailHeader from "@/components/policies/detail/PolicyDetailHeader";
import PolicyDetailSummary from "@/components/policies/detail/PolicyDetailSummary";
import PolicyDocumentsTab from "@/components/policies/detail/PolicyDocumentsTab";
import PolicyClaimsTab from "@/components/policies/detail/PolicyClaimsTab";
import PolicyFinancialsTab from "@/components/policies/detail/PolicyFinancialsTab";
import PolicyHistoryTab from "@/components/policies/detail/PolicyHistoryTab";

const PolicyDetailPage = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { t, formatDate, formatCurrency } = useLanguage();
  const { toast } = useToast();

  const { data: policy, isLoading, isError, error } = useQuery({
    queryKey: ['policy', policyId],
    queryFn: async () => {
      if (!policyId) throw new Error("Policy ID is required");
      
      const { data, error } = await supabase
        .from('policies')
        .select(`
          *,
          policy_documents(count),
          claims(count)
        `)
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handleEditPolicy = () => {
    if (policyId) {
      navigate(`/policies/${policyId}/edit`);
    }
  };

  const handleRenewPolicy = () => {
    // To be implemented
    toast({
      title: t("renewalInitiated"),
      description: t("policyRenewalInProgress"),
    });
  };

  const handleExportPolicy = () => {
    // To be implemented
    toast({
      title: t("exportStarted"),
      description: t("policyExportInProgress"),
    });
  };

  const handleBackToList = () => {
    navigate("/policies");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Button variant="ghost" onClick={handleBackToList}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToPolicies")}
        </Button>
        <div className="space-y-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-6 w-[350px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !policy) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={handleBackToList}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToPolicies")}
        </Button>
        
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">{t("policyNotFound")}</h3>
              <p className="text-muted-foreground mt-2">
                {error instanceof Error ? error.message : t("errorLoadingPolicy")}
              </p>
              <Button className="mt-4" onClick={handleBackToList}>
                {t("backToPolicies")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={handleBackToList} className="group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {t("backToPolicies")}
      </Button>
      
      <PolicyDetailHeader 
        policy={policy}
        onEdit={handleEditPolicy}
        onRenew={handleRenewPolicy}
        onExport={handleExportPolicy}
      />
      
      <PolicyDetailSummary policy={policy} />
      
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="documents">
            {t("documents")}
            {policy.policy_documents_count > 0 && (
              <Badge variant="secondary" className="ml-2">{policy.policy_documents_count}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="claims">
            {t("claims")}
            {policy.claims_count > 0 && (
              <Badge variant="secondary" className="ml-2">{policy.claims_count}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="financials">{t("financials")}</TabsTrigger>
          <TabsTrigger value="history">{t("history")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <PolicyDocumentsTab policyId={policy.id} />
        </TabsContent>
        
        <TabsContent value="claims">
          <PolicyClaimsTab policyId={policy.id} />
        </TabsContent>
        
        <TabsContent value="financials">
          <PolicyFinancialsTab policyId={policy.id} />
        </TabsContent>
        
        <TabsContent value="history">
          <PolicyHistoryTab policyId={policy.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PolicyDetailPage;
