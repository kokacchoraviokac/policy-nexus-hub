
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Import, AlertCircle, RefreshCw } from "lucide-react";
import WorkflowFilters from "@/components/policies/workflow/WorkflowFilters";
import WorkflowPoliciesList from "@/components/policies/workflow/WorkflowPoliciesList";
import { supabase } from "@/integrations/supabase/client";
import { Policy } from "@/types/policies";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { policiesToWorkflowPolicies } from "@/utils/policies/policyMappers";

const PolicyWorkflow = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("draft");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    fetchPolicies();
  }, [activeTab, searchTerm, currentPage, statusFilter]);
  
  const fetchPolicies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Determine which workflow statuses to fetch based on active tab
      let workflowStatuses: string[] = [];
      
      if (activeTab === "draft") {
        workflowStatuses = ["draft", "in_review"];
      } else if (activeTab === "ready") {
        workflowStatuses = ["ready"];
      } else if (activeTab === "complete") {
        workflowStatuses = ["complete"];
      }
      
      // If statusFilter is not 'all', override with the specific filter
      if (statusFilter !== "all") {
        workflowStatuses = [statusFilter];
      }
      
      // Calculate pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Build query
      let query = supabase
        .from("policies")
        .select("*", { count: "exact" });
      
      // Apply workflow status filter
      if (workflowStatuses.length > 0) {
        query = query.in("workflow_status", workflowStatuses);
      }
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(
          `policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%,insurer_name.ilike.%${searchTerm}%`
        );
      }
      
      // Apply pagination
      query = query.range(from, to).order("created_at", { ascending: false });
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setPolicies(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching policies:", err);
      setError(err instanceof Error ? err : new Error("Unknown error fetching policies"));
      
      toast({
        title: t("error"),
        description: t("errorLoadingPolicies"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePolicySelect = (policyId: string) => {
    navigate(`/policies/workflow/review/${policyId}`);
  };
  
  const handleRefresh = () => {
    fetchPolicies();
    
    toast({
      title: t("refreshing"),
      description: t("refreshingPolicies"),
    });
  };
  
  const handleImport = () => {
    navigate("/policies/import");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("policiesWorkflow")}</h1>
          <p className="text-muted-foreground">
            {t("policiesWorkflowDescription")}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            {t("refresh")}
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            onClick={handleImport}
            className="gap-1.5"
          >
            <Import className="h-4 w-4" />
            {t("importPolicies")}
          </Button>
        </div>
      </div>
      
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
            
            <TabsContent value="draft" className="mt-6">
              <div className="mb-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t("reviewAndFinalizeImportedPolicies")}</AlertTitle>
                  <AlertDescription>
                    {t("policiesInPendingDescription")}
                  </AlertDescription>
                </Alert>
              </div>
              
              <WorkflowPoliciesList 
                policies={policiesToWorkflowPolicies(policies)}
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
            
            <TabsContent value="ready" className="mt-6">
              <div className="mb-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t("finalizePoliciesReadyForApproval")}</AlertTitle>
                  <AlertDescription>
                    {t("policiesReadyDescription")}
                  </AlertDescription>
                </Alert>
              </div>
              
              <WorkflowPoliciesList 
                policies={policiesToWorkflowPolicies(policies)}
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
            
            <TabsContent value="complete" className="mt-6">
              <div className="mb-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t("viewFinalizedPoliciesHistory")}</AlertTitle>
                  <AlertDescription>
                    {t("policiesCompletedDescription")}
                  </AlertDescription>
                </Alert>
              </div>
              
              <WorkflowPoliciesList 
                policies={policiesToWorkflowPolicies(policies)}
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
