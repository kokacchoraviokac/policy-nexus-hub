
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { usePolicyDetail } from "@/hooks/usePolicyDetail";
import PolicyReviewActions from "@/components/policies/workflow/PolicyReviewActions";
import PolicyReviewSummary from "@/components/policies/workflow/PolicyReviewSummary";
import PolicyEditForm from "@/components/policies/workflow/PolicyEditForm";
import PolicyReviewChecklist from "@/components/policies/workflow/PolicyReviewChecklist";
import PolicyDocumentsCheck from "@/components/policies/workflow/PolicyDocumentsCheck";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";

const PolicyReview = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const { data: policy, isLoading, isError } = usePolicyDetail(policyId);
  
  const handleBackClick = () => {
    navigate('/policies/workflow');
  };
  
  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t("loadingPolicy")}</p>
        </div>
      </div>
    );
  }
  
  if (isError || !policy) {
    return (
      <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20 text-center">
        <h3 className="text-lg font-semibold mb-2">{t("policyLoadError")}</h3>
        <p className="text-muted-foreground mb-4">{t("policyLoadErrorMessage")}</p>
        <Button variant="outline" onClick={handleBackClick}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("backToWorkflow")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-fit"
          onClick={handleBackClick}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("backToWorkflow")}
        </Button>
        
        <PolicyReviewActions policy={policy} isComplete={isFormComplete} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="summary">{t("summary")}</TabsTrigger>
          <TabsTrigger value="edit">{t("edit")}</TabsTrigger>
          <TabsTrigger value="checklist">{t("checklist")}</TabsTrigger>
          <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-0">
          <PolicyReviewSummary policy={policy} />
        </TabsContent>
        
        <TabsContent value="edit" className="mt-0">
          <PolicyEditForm policy={policy} />
        </TabsContent>
        
        <TabsContent value="checklist" className="mt-0">
          <PolicyReviewChecklist policy={policy} />
        </TabsContent>
        
        <TabsContent value="documents" className="mt-0">
          <PolicyDocumentsCheck 
            policy={policy} 
            onUploadClick={handleUploadClick} 
          />
        </TabsContent>
      </Tabs>
      
      {uploadDialogOpen && policy && (
        <DocumentUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          entityType="policy"
          entityId={policy.id}
        />
      )}
    </div>
  );
};

export default PolicyReview;
