
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkflowFilters from "@/components/policies/workflow/WorkflowFilters";
import WorkflowTabContent from "@/components/policies/workflow/tabs/WorkflowTabContent";
import WorkflowHeader from "@/components/policies/workflow/WorkflowHeader";
import { policiesToWorkflowPolicies } from "@/utils/policies/policyMappers";
import { usePoliciesWorkflow } from "@/hooks/usePoliciesWorkflow";

const PolicyWorkflow = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    policies,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalCount,
    pageSize,
    statusFilter,
    setStatusFilter,
    handleRefresh
  } = usePoliciesWorkflow();
  
  const handlePolicySelect = (policyId: string) => {
    navigate(`/policies/workflow/review/${policyId}`);
  };
  
  const handleImport = () => {
    navigate("/policies/import");
  };
  
  const workflowPolicies = policiesToWorkflowPolicies(policies);
  
  return (
    <div className="space-y-6">
      <WorkflowHeader onRefresh={handleRefresh} onImport={handleImport} />
      
      <Card className="overflow-hidden">
        <Tabs defaultValue="draft" value={activeTab} onValueChange={setActiveTab}>
          <div className="p-4 border-b">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="draft">
                {t("pendingReview")}
              </TabsTrigger>
              <TabsTrigger value="ready">
                {t("readyForFinalization")}
              </TabsTrigger>
              <TabsTrigger value="complete">
                {t("finalizedPolicies")}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-6">
            <WorkflowFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onRefresh={handleRefresh}
              workflowStatus={statusFilter}
              onWorkflowStatusChange={setStatusFilter}
            />
            
            <TabsContent value="draft">
              <WorkflowTabContent
                title={t("reviewAndFinalizeImportedPolicies")}
                description={t("policiesInPendingDescription")}
                policies={workflowPolicies}
                isLoading={isLoading}
                isError={!!error}
                onReviewPolicy={handlePolicySelect}
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                workflowStatus={statusFilter}
                onStatusChange={setStatusFilter}
              />
            </TabsContent>
            
            <TabsContent value="ready">
              <WorkflowTabContent
                title={t("finalizePoliciesReadyForApproval")}
                description={t("policiesReadyDescription")}
                policies={workflowPolicies}
                isLoading={isLoading}
                isError={!!error}
                onReviewPolicy={handlePolicySelect}
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                workflowStatus={statusFilter}
                onStatusChange={setStatusFilter}
              />
            </TabsContent>
            
            <TabsContent value="complete">
              <WorkflowTabContent
                title={t("viewFinalizedPoliciesHistory")}
                description={t("policiesCompletedDescription")}
                policies={workflowPolicies}
                isLoading={isLoading}
                isError={!!error}
                onReviewPolicy={handlePolicySelect}
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                workflowStatus={statusFilter}
                onStatusChange={setStatusFilter}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default PolicyWorkflow;
