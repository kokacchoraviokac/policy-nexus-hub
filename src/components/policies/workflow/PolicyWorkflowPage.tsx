
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileCheck, FileEdit, FileSpreadsheet, Clock, CheckCircle2, Import } from "lucide-react";
import WorkflowFilters from "@/components/policies/workflow/WorkflowFilters";
import WorkflowPoliciesList from "@/components/policies/workflow/WorkflowPoliciesList";
import { useWorkflowPolicies } from "@/hooks/useWorkflowPolicies";

const PolicyWorkflowPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pending" | "reviewed" | "all">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { 
    policies, 
    isLoading, 
    error,
    setFilters,
    refreshPolicies
  } = useWorkflowPolicies(activeTab);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as "pending" | "reviewed" | "all");
  };
  
  const handleSearch = (term: string) => {
    setFilters(prev => ({ ...prev, search: term }));
    setSearchTerm(term);
  };
  
  const handleRefresh = () => {
    refreshPolicies();
  };
  
  const handleReviewPolicy = (policyId: string) => {
    navigate(`/policies/workflow/review/${policyId}`);
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
    <div className="space-y-6">
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
        <div className="p-6">
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
        </div>
      </Card>
      
      <div className="bg-background border rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <Tabs defaultValue="pending" onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">{t("pendingReview")}</TabsTrigger>
              <TabsTrigger value="reviewed">{t("reviewComplete")}</TabsTrigger>
              <TabsTrigger value="all">{t("allWorkflowStatuses")}</TabsTrigger>
            </TabsList>
            
            <WorkflowFilters 
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              onRefresh={handleRefresh}
            />
            
            <TabsContent value="pending" className="mt-4">
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <h3 className="font-medium text-blue-800">{t("reviewAndFinalizeImportedPolicies")}</h3>
                <p className="text-sm text-blue-600 mt-1">{t("policiesInPendingDescription")}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviewed" className="mt-4">
              <div className="bg-green-50 p-4 rounded-md mb-4">
                <h3 className="font-medium text-green-800">{t("finalizePoliciesReadyForApproval")}</h3>
                <p className="text-sm text-green-600 mt-1">{t("policiesReadyDescription")}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="mt-4">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="font-medium text-gray-800">{t("viewFinalizedPoliciesHistory")}</h3>
                <p className="text-sm text-gray-600 mt-1">{t("policiesCompletedDescription")}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="p-6">
          <WorkflowPoliciesList 
            policies={policies}
            isLoading={isLoading}
            onReviewPolicy={handleReviewPolicy}
          />
        </div>
      </div>
    </div>
  );
};

export default PolicyWorkflowPage;
