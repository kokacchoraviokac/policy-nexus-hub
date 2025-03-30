
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import WorkflowFilters from "@/components/policies/workflow/WorkflowFilters";
import WorkflowPoliciesList from "@/components/policies/workflow/WorkflowPoliciesList";

const PolicyWorkflow = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const handlePolicySelect = (policyId: string) => {
    navigate(`/policies/workflow/${policyId}`);
  };
  
  const handleRefresh = () => {
    // Placeholder for refresh functionality
    console.log("Refreshing policy workflow");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("policiesWorkflow")}</h1>
        <p className="text-muted-foreground">
          {t("policiesWorkflowDescription")}
        </p>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-4">{t("policyProcessing")}</h2>
          
          <WorkflowFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={handleRefresh}
          />
        </div>
        
        <div>
          <WorkflowPoliciesList 
            policies={[]} // Will be populated with actual data
            isLoading={false}
            onReviewPolicy={handlePolicySelect}
          />
        </div>
      </Card>
    </div>
  );
};

export default PolicyWorkflow;
