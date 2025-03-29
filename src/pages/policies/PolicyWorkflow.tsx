
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, FileUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkflowPoliciesList from "@/components/policies/workflow/WorkflowPoliciesList";
import WorkflowFilters from "@/components/policies/workflow/WorkflowFilters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const PolicyWorkflow = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const handleRefresh = () => {
    // Will be triggered by the WorkflowPoliciesList component
  };
  
  const handleImportPolicies = () => {
    // This functionality would be implemented in a future update
    toast({
      title: t("featureNotAvailable"),
      description: t("policyImportFeatureComingSoon"),
    });
  };

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
          <Button onClick={handleImportPolicies}>
            <FileUp className="mr-2 h-4 w-4" />
            {t("importPolicies")}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("workflowStages")}</CardTitle>
          <CardDescription>{t("policyWorkflowStagesDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium">{t("draft")}</h3>
              <p className="text-xs text-muted-foreground">{t("draftStageDescription")}</p>
            </div>
            
            <ArrowRight className="hidden md:block h-4 w-4 text-muted-foreground" />
            <div className="w-0.5 h-6 bg-muted md:hidden"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                <FileUp className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium">{t("inReview")}</h3>
              <p className="text-xs text-muted-foreground">{t("inReviewStageDescription")}</p>
            </div>
            
            <ArrowRight className="hidden md:block h-4 w-4 text-muted-foreground" />
            <div className="w-0.5 h-6 bg-muted md:hidden"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-medium">{t("ready")}</h3>
              <p className="text-xs text-muted-foreground">{t("readyStageDescription")}</p>
            </div>
            
            <ArrowRight className="hidden md:block h-4 w-4 text-muted-foreground" />
            <div className="w-0.5 h-6 bg-muted md:hidden"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-medium">{t("complete")}</h3>
              <p className="text-xs text-muted-foreground">{t("completeStageDescription")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-border">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-4">{t("policiesRequiringAction")}</h2>
          
          <WorkflowFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onRefresh={handleRefresh}
          />
        </div>
        
        <div>
          <WorkflowPoliciesList 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default PolicyWorkflow;
