
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { usePolicyDetail } from "@/hooks/usePolicyDetail";
import { useActivityLogger } from "@/utils/activityLogger";
import BackToPoliciesButton from "@/components/policies/detail/BackToPoliciesButton";
import PolicyDetailLoading from "@/components/policies/detail/PolicyDetailLoading";
import PolicyDetailError from "@/components/policies/detail/PolicyDetailError";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/format";
import { CheckCircle, AlertTriangle, Save, X, ArrowLeft, Check } from "lucide-react";

const PolicyReviewPage = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: policy, isLoading, isError, error } = usePolicyDetail(policyId);
  
  const updateWorkflowStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      if (!policyId) throw new Error("Policy ID is required");
      
      const { data, error } = await supabase
        .from('policies')
        .update({ 
          workflow_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', policyId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, newStatus) => {
      queryClient.invalidateQueries({ queryKey: ['policy', policyId] });
      queryClient.invalidateQueries({ queryKey: ['policies-workflow'] });
      
      // Log the activity
      logActivity({
        entityType: "policy",
        entityId: policyId!,
        action: "update",
        details: {
          changes: { workflow_status: { old: policy?.workflow_status, new: newStatus } },
          note: `Policy workflow status updated to ${newStatus}`
        }
      });
      
      toast({
        title: t("statusUpdated"),
        description: t("policyWorkflowStatusUpdated", { status: newStatus }),
      });
      
      if (newStatus === "complete") {
        navigate(`/policies/${policyId}`);
      }
    },
    onError: (error) => {
      console.error("Error updating workflow status:", error);
      toast({
        title: t("errorUpdatingStatus"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  const handleMoveToReview = () => {
    updateWorkflowStatusMutation.mutate("in_review");
  };
  
  const handleMarkAsReady = () => {
    updateWorkflowStatusMutation.mutate("ready");
  };
  
  const handleFinalizePolicy = () => {
    updateWorkflowStatusMutation.mutate("complete");
  };
  
  const handleBackToWorkflow = () => {
    navigate("/policies/workflow");
  };
  
  const getMissingRequiredFields = () => {
    if (!policy) return [];
    
    const requiredFields: { field: string; name: string }[] = [
      { field: "policy_number", name: t("policyNumber") },
      { field: "insurer_name", name: t("insurer") },
      { field: "policyholder_name", name: t("client") },
      { field: "start_date", name: t("startDate") },
      { field: "expiry_date", name: t("expiryDate") },
      { field: "premium", name: t("premium") },
    ];
    
    return requiredFields.filter(({ field }) => !policy[field as keyof typeof policy]);
  };
  
  const missingFields = policy ? getMissingRequiredFields() : [];
  const isReadyForReview = missingFields.length === 0 && policy?.workflow_status === "draft";
  const isReadyForFinalization = missingFields.length === 0 && policy?.workflow_status === "ready";
  
  if (isLoading) {
    return <PolicyDetailLoading />;
  }
  
  if (isError || !policy) {
    return (
      <PolicyDetailError 
        error={error instanceof Error ? error : undefined}
        onBackToList={handleBackToWorkflow}
      />
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <BackToPoliciesButton onClick={handleBackToWorkflow} />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("reviewPolicy")}: {policy.policy_number || t("newPolicy")}
          </h1>
          <p className="text-muted-foreground">
            {t("reviewImportedPolicyAndFinalizeIt")}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant={
              policy.workflow_status === "draft" ? "outline" :
              policy.workflow_status === "in_review" ? "secondary" : "default"
            }
            className="text-sm py-1.5"
          >
            {policy.workflow_status === "draft" && t("draft")}
            {policy.workflow_status === "in_review" && t("inReview")}
            {policy.workflow_status === "ready" && t("ready")}
          </Badge>
        </div>
      </div>
      
      {missingFields.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t("missingRequiredFields")}</AlertTitle>
          <AlertDescription>
            {t("followingFieldsAreRequired")}:
            <ul className="mt-2 list-disc pl-5">
              {missingFields.map(field => (
                <li key={field.field}>{field.name}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="review">{t("reviewChecklist")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("policyDetails")}</CardTitle>
              <CardDescription>{t("basicInformationAboutPolicy")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("policyNumber")}</h3>
                  <p className="text-base">{policy.policy_number || "-"}</p>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("policyType")}</h3>
                  <p className="text-base">{policy.policy_type || "-"}</p>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("insurer")}</h3>
                  <p className="text-base">{policy.insurer_name || "-"}</p>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("product")}</h3>
                  <p className="text-base">{policy.product_name || "-"}</p>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("client")}</h3>
                  <p className="text-base">{policy.policyholder_name || "-"}</p>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("insured")}</h3>
                  <p className="text-base">{policy.insured_name || "-"}</p>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("startDate")}</h3>
                  <p className="text-base">{policy.start_date ? formatDate(policy.start_date) : "-"}</p>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("expiryDate")}</h3>
                  <p className="text-base">{policy.expiry_date ? formatDate(policy.expiry_date) : "-"}</p>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("premium")}</h3>
                  <p className="text-base">{policy.premium ? formatCurrency(policy.premium, policy.currency) : "-"}</p>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("paymentFrequency")}</h3>
                  <p className="text-base">{policy.payment_frequency || "-"}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("commissionType")}</h3>
                  <p className="text-base">{policy.commission_type || "-"}</p>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("commissionPercentage")}</h3>
                  <p className="text-base">{policy.commission_percentage ? `${policy.commission_percentage}%` : "-"}</p>
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-medium text-muted-foreground">{t("commissionAmount")}</h3>
                  <p className="text-base">
                    {policy.commission_amount ? formatCurrency(policy.commission_amount, policy.currency) : "-"}
                  </p>
                </div>
              </div>
              
              {policy.notes && (
                <>
                  <Separator />
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">{t("notes")}</h3>
                    <p className="text-base whitespace-pre-line">{policy.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t("workflowActions")}</CardTitle>
              <CardDescription>{t("manageWorkflowStatusOfPolicy")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Badge variant={policy.workflow_status === "draft" ? "outline" : "default"} className="w-24 justify-center">
                    {t("draft")}
                  </Badge>
                  <div className="flex-1 h-0.5 bg-muted"></div>
                  <Badge variant={policy.workflow_status === "in_review" ? "secondary" : "outline"} className="w-24 justify-center">
                    {t("inReview")}
                  </Badge>
                  <div className="flex-1 h-0.5 bg-muted"></div>
                  <Badge variant={policy.workflow_status === "ready" ? "default" : "outline"} className="w-24 justify-center">
                    {t("ready")}
                  </Badge>
                  <div className="flex-1 h-0.5 bg-muted"></div>
                  <Badge variant="outline" className="w-24 justify-center">
                    {t("complete")}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 justify-end">
              {policy.workflow_status === "draft" && (
                <Button 
                  variant="default" 
                  disabled={!isReadyForReview || updateWorkflowStatusMutation.isPending}
                  onClick={handleMoveToReview}
                >
                  {updateWorkflowStatusMutation.isPending ? (
                    t("updating")
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {t("moveToReview")}
                    </>
                  )}
                </Button>
              )}
              
              {policy.workflow_status === "in_review" && (
                <Button 
                  variant="default" 
                  disabled={missingFields.length > 0 || updateWorkflowStatusMutation.isPending}
                  onClick={handleMarkAsReady}
                >
                  {updateWorkflowStatusMutation.isPending ? (
                    t("updating")
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {t("markAsReady")}
                    </>
                  )}
                </Button>
              )}
              
              {policy.workflow_status === "ready" && (
                <Button 
                  variant="default" 
                  disabled={!isReadyForFinalization || updateWorkflowStatusMutation.isPending}
                  onClick={handleFinalizePolicy}
                >
                  {updateWorkflowStatusMutation.isPending ? (
                    t("updating")
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {t("finalizePolicy")}
                    </>
                  )}
                </Button>
              )}
              
              <Button variant="outline" onClick={handleBackToWorkflow}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToWorkflow")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("reviewChecklist")}</CardTitle>
              <CardDescription>{t("ensureAllRequiredInformationIsComplete")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {[
                  { field: "policy_number", name: t("policyNumber"), value: policy.policy_number },
                  { field: "insurer_name", name: t("insurer"), value: policy.insurer_name },
                  { field: "policyholder_name", name: t("client"), value: policy.policyholder_name },
                  { field: "start_date", name: t("startDate"), value: policy.start_date },
                  { field: "expiry_date", name: t("expiryDate"), value: policy.expiry_date },
                  { field: "premium", name: t("premium"), value: policy.premium },
                  { field: "currency", name: t("currency"), value: policy.currency },
                  { field: "policy_type", name: t("policyType"), value: policy.policy_type },
                  { field: "commission_percentage", name: t("commissionPercentage"), value: policy.commission_percentage, optional: true },
                  { field: "product_name", name: t("product"), value: policy.product_name, optional: true },
                ].map(item => (
                  <li key={item.field} className="flex items-center justify-between">
                    <span className="text-sm">
                      {item.name}
                      {item.optional && <span className="text-muted-foreground ml-1">({t("optional")})</span>}
                    </span>
                    {item.value ? (
                      <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {t("complete")}
                      </Badge>
                    ) : (
                      <Badge variant={item.optional ? "outline" : "destructive"}>
                        {item.optional ? (
                          <span>{t("missing")}</span>
                        ) : (
                          <>
                            <X className="mr-1 h-3 w-3" />
                            {t("required")}
                          </>
                        )}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("documentsCheck")}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("policyDocuments")}</span>
                  <Badge variant={policy.documents_count ? "outline" : "secondary"} className={policy.documents_count ? "bg-green-50 text-green-600 hover:bg-green-50 border-green-200" : ""}>
                    {policy.documents_count ? (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {t("documentsAttached", { count: policy.documents_count })}
                      </>
                    ) : (
                      t("noDocuments")
                    )}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(`/policies/${policyId}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                {t("editPolicy")}
              </Button>
              
              <Button 
                variant="default" 
                disabled={missingFields.length > 0 || updateWorkflowStatusMutation.isPending}
                onClick={() => {
                  if (policy.workflow_status === "draft") {
                    handleMoveToReview();
                  } else if (policy.workflow_status === "in_review") {
                    handleMarkAsReady();
                  } else if (policy.workflow_status === "ready") {
                    handleFinalizePolicy();
                  }
                }}
              >
                {updateWorkflowStatusMutation.isPending ? (
                  t("updating")
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {policy.workflow_status === "draft" && t("moveToReview")}
                    {policy.workflow_status === "in_review" && t("markAsReady")}
                    {policy.workflow_status === "ready" && t("finalizePolicy")}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PolicyReviewPage;
