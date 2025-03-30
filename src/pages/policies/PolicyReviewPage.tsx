
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePolicyDetail } from "@/hooks/usePolicyDetail";
import { useLanguage } from "@/contexts/LanguageContext";
import BackToPoliciesButton from "@/components/policies/detail/BackToPoliciesButton";
import PolicyDetailLoading from "@/components/policies/detail/PolicyDetailLoading";
import PolicyDetailError from "@/components/policies/detail/PolicyDetailError";
import PolicyReviewChecklist from "@/components/policies/workflow/PolicyReviewChecklist";
import PolicyReviewActions from "@/components/policies/workflow/PolicyReviewActions";
import PolicyDocumentsTab from "@/components/policies/detail/PolicyDocumentsTab";
import PolicyStatusWorkflow from "@/components/policies/workflow/PolicyStatusWorkflow";
import PolicyDocumentsCheck from "@/components/policies/workflow/PolicyDocumentsCheck";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";
import PolicyReviewSummary from "@/components/policies/workflow/PolicyReviewSummary";
import PolicyEditForm from "@/components/policies/workflow/PolicyEditForm";
import { InfoIcon } from "lucide-react";

const PolicyReviewPage = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: policy, isLoading, isError, error, refetch } = usePolicyDetail(policyId);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  React.useEffect(() => {
    if (policy) {
      // Check if all required fields are complete
      const requiredFields = [
        policy.policy_number,
        policy.insurer_name,
        policy.policyholder_name,
        policy.start_date,
        policy.expiry_date,
        policy.premium,
        policy.currency
      ];
      
      setIsFormComplete(requiredFields.every(field => !!field));
    }
  }, [policy]);
  
  const handleBackToList = () => {
    navigate("/policies/workflow");
  };
  
  const handleUploadDocument = () => {
    setUploadDialogOpen(true);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleFormSuccess = () => {
    refetch();
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <BackToPoliciesButton onClick={handleBackToList} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("reviewPolicy")}</h1>
          <p className="text-muted-foreground">
            {t("reviewImportedPolicyAndFinalizeIt")}
          </p>
        </div>
      </div>
      
      {isLoading ? (
        <PolicyDetailLoading />
      ) : isError || !policy ? (
        <PolicyDetailError 
          error={error instanceof Error ? error : undefined} 
          onBackToList={handleBackToList} 
        />
      ) : (
        <>
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm ml-2">
              {t("policyImportInfo")}
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
                  <TabsTrigger value="edit">{t("edit")}</TabsTrigger>
                  <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">{t("policyDetails")}</h2>
                      <p className="text-sm text-muted-foreground mb-6">{t("basicInformationAboutPolicy")}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("policyNumber")}</h3>
                          <p className="mt-1">{policy.policy_number || t("notProvided")}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("insurer")}</h3>
                          <p className="mt-1">{policy.insurer_name || t("notProvided")}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("product")}</h3>
                          <p className="mt-1">{policy.product_name || t("notProvided")}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("policyholder")}</h3>
                          <p className="mt-1">{policy.policyholder_name || t("notProvided")}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("insured")}</h3>
                          <p className="mt-1">{policy.insured_name || t("notProvided")}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("policyType")}</h3>
                          <p className="mt-1">{policy.policy_type || t("notProvided")}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("startDate")}</h3>
                          <p className="mt-1">{policy.start_date || t("notProvided")}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("expiryDate")}</h3>
                          <p className="mt-1">{policy.expiry_date || t("notProvided")}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("premium")}</h3>
                          <p className="mt-1">
                            {policy.premium 
                              ? `${policy.premium} ${policy.currency}` 
                              : t("notProvided")}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("commissionPercentage")}</h3>
                          <p className="mt-1">
                            {policy.commission_percentage 
                              ? `${policy.commission_percentage}%` 
                              : t("notProvided")}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("paymentFrequency")}</h3>
                          <p className="mt-1">{policy.payment_frequency || t("notProvided")}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">{t("notes")}</h3>
                          <p className="mt-1">{policy.notes || t("notProvided")}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="edit">
                  <PolicyEditForm policy={policy} onSuccess={handleFormSuccess} />
                </TabsContent>
                
                <TabsContent value="documents">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">{t("documents")}</h2>
                      <div className="mt-4">
                        <PolicyDocumentsTab policyId={policy.id} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <PolicyStatusWorkflow 
                    policyId={policy.id}
                    currentStatus={policy.status}
                    currentWorkflowStatus={policy.workflow_status}
                    onStatusUpdated={() => refetch()}
                  />
                </CardContent>
              </Card>
              
              <PolicyReviewSummary policy={policy} />
              
              <Card>
                <CardContent className="pt-6">
                  <PolicyReviewChecklist policy={policy} />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <PolicyDocumentsCheck 
                    policy={policy} 
                    onUploadClick={handleUploadDocument}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <PolicyReviewActions 
                    policy={policy} 
                    isComplete={isFormComplete}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
      
      {policy && (
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

export default PolicyReviewPage;
