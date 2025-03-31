
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, FileEdit, FileSpreadsheet, Clock, CheckCircle2, Import } from "lucide-react";
import WorkflowPoliciesList from "@/components/policies/workflow/WorkflowPoliciesList";
import WorkflowFilters from "@/components/policies/workflow/WorkflowFilters";
import { Policy } from "@/types/policies";
import { policiesToWorkflowPolicies } from "@/utils/policies/policyMappers";

const PolicyWorkflow = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("draft");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['policies-workflow', activeTab, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('policies')
        .select('*', { count: 'exact' });
      
      if (activeTab !== 'all') {
        query = query.eq('workflow_status', activeTab);
      }
      
      if (searchTerm) {
        query = query.or(
          `policy_number.ilike.%${searchTerm}%,` +
          `policyholder_name.ilike.%${searchTerm}%,` +
          `insurer_name.ilike.%${searchTerm}%`
        );
      }
      
      const { data, error, count } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return {
        policies: data as Policy[],
        totalCount: count || 0
      };
    }
  });
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const handleReviewPolicy = (policyId: string) => {
    navigate(`/policies/${policyId}/review`);
  };
  
  const handleImportPolicy = () => {
    navigate("/policies/import");
  };
  
  const workflowStages = [
    {
      id: "draft",
      name: t("draft"),
      description: t("draftStageDescription"),
      icon: FileSpreadsheet,
      color: "text-blue-500",
    },
    {
      id: "in_review",
      name: t("inReview"),
      description: t("inReviewStageDescription"),
      icon: FileEdit,
      color: "text-orange-500",
    },
    {
      id: "ready",
      name: t("ready"),
      description: t("readyStageDescription"),
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      id: "complete",
      name: t("complete"),
      description: t("completeStageDescription"),
      icon: CheckCircle2,
      color: "text-green-500",
    },
  ];
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("policiesWorkflow")}</h1>
          <p className="text-muted-foreground">
            {t("policiesWorkflowDescription")}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleImportPolicy}>
            <Import className="mr-2 h-4 w-4" />
            {t("importPolicy")}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("workflowStages")}</CardTitle>
          <CardDescription>{t("policyWorkflowStagesDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {workflowStages.map((stage) => (
              <div key={stage.id} className="relative p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex items-center mb-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${stage.id === 'complete' ? 'bg-green-100' : 'bg-muted'}`}>
                    <stage.icon className={`h-5 w-5 ${stage.color}`} />
                  </div>
                  <h3 className="ml-2 font-medium">{stage.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="draft" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="draft">{t("draft")}</TabsTrigger>
          <TabsTrigger value="in_review">{t("inReview")}</TabsTrigger>
          <TabsTrigger value="ready">{t("ready")}</TabsTrigger>
          <TabsTrigger value="complete">{t("complete")}</TabsTrigger>
          <TabsTrigger value="all">{t("allWorkflowStatuses")}</TabsTrigger>
        </TabsList>
        
        <WorkflowFilters 
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          onRefresh={handleRefresh}
        />
        
        <div className="mt-4">
          <TabsContent value="draft" className="m-0 mt-4">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{t("importedPolicies")}</CardTitle>
                <CardDescription>{t("policiesInPendingDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowPoliciesList 
                  policies={policiesToWorkflowPolicies(data?.policies.filter(p => p.workflow_status === 'draft') || [])}
                  isLoading={isLoading}
                  onReviewPolicy={handleReviewPolicy}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="in_review" className="m-0 mt-4">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{t("pendingReview")}</CardTitle>
                <CardDescription>{t("policiesInPendingDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowPoliciesList 
                  policies={policiesToWorkflowPolicies(data?.policies.filter(p => p.workflow_status === 'in_review') || [])}
                  isLoading={isLoading}
                  onReviewPolicy={handleReviewPolicy}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ready" className="m-0 mt-4">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{t("readyForFinalization")}</CardTitle>
                <CardDescription>{t("policiesReadyDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowPoliciesList 
                  policies={policiesToWorkflowPolicies(data?.policies.filter(p => p.workflow_status === 'ready') || [])}
                  isLoading={isLoading}
                  onReviewPolicy={handleReviewPolicy}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="complete" className="m-0 mt-4">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{t("finalizedPolicies")}</CardTitle>
                <CardDescription>{t("policiesCompletedDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowPoliciesList 
                  policies={policiesToWorkflowPolicies(data?.policies.filter(p => p.workflow_status === 'complete') || [])}
                  isLoading={isLoading}
                  onReviewPolicy={handleReviewPolicy}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all" className="m-0 mt-4">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{t("policiesRequiringAction")}</CardTitle>
                <CardDescription>{t("reviewAndFinalizeImportedPolicies")}</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowPoliciesList 
                  policies={policiesToWorkflowPolicies(data?.policies || [])}
                  isLoading={isLoading}
                  onReviewPolicy={handleReviewPolicy}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PolicyWorkflow;
