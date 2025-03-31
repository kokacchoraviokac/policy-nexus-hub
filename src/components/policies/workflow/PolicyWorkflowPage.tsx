
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PolicyWorkflowFilters from "./PolicyWorkflowFilters";
import PolicyWorkflowList from "./PolicyWorkflowList";
import { useWorkflowPolicies } from "@/hooks/useWorkflowPolicies";
import { Button } from "@/components/ui/button";
import { DownloadIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { exportWorkflowTemplate } from "@/utils/policies/exportUtils";

const PolicyWorkflowPage: React.FC = () => {
  const { t } = useLanguage();
  const [currentTab, setCurrentTab] = useState<string>("pending");
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    policies,
    isLoading,
    totalCount,
    page,
    pageSize,
    setPage,
    setPageSize,
    filters,
    setFilters,
    refreshPolicies
  } = useWorkflowPolicies(currentTab as "pending" | "reviewed" | "all");
  
  const handleExportTemplate = async () => {
    try {
      setIsExporting(true);
      const blob = await exportWorkflowTemplate();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'policy_workflow_template.xlsx';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(t("templateExported"), {
        description: t("templateExportedSuccess")
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error(t("exportFailed"), {
        description: t("errorExportingTemplate")
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("policyWorkflow")}</h1>
          <p className="text-muted-foreground">
            {t("policyWorkflowDescription")}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={refreshPolicies}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("refresh")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportTemplate} disabled={isExporting}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            {isExporting ? t("exporting") : t("exportTemplate")}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("policyReviewWorkflow")}</CardTitle>
          <CardDescription>
            {t("reviewAndFinalizePolicies")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="pending"
            value={currentTab}
            onValueChange={(value) => {
              setCurrentTab(value);
              setPage(1);
            }}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="pending">{t("pendingReview")}</TabsTrigger>
              <TabsTrigger value="reviewed">{t("reviewed")}</TabsTrigger>
              <TabsTrigger value="all">{t("allPolicies")}</TabsTrigger>
            </TabsList>
            
            <PolicyWorkflowFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
            
            <div className="mt-4">
              <PolicyWorkflowList
                policies={policies}
                isLoading={isLoading}
                totalCount={totalCount}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyWorkflowPage;
