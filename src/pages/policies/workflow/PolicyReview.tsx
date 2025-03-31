
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { isPolicyComplete, getMissingFields } from "@/utils/policyWorkflowUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import PolicyReviewDetails from "@/components/policies/workflow/PolicyReviewDetails";
import PolicyReviewForm from "@/components/policies/workflow/PolicyReviewForm";
import PolicyReviewActions from "@/components/policies/workflow/PolicyReviewActions";
import WorkflowStatusBadge from "@/components/policies/workflow/WorkflowStatusBadge";

const PolicyReview = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("overview");
  
  const { data: policy, isLoading, error } = useQuery({
    queryKey: ['policy', id],
    queryFn: async () => {
      if (!id) throw new Error("No policy ID provided");
      
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Policy;
    },
    enabled: !!id
  });
  
  const handleBackToWorkflow = () => {
    navigate("/policies/workflow");
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBackToWorkflow}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToWorkflow")}
          </Button>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p>{t("loadingPolicy")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !policy) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBackToWorkflow}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToWorkflow")}
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("policyLoadError")}</AlertTitle>
          <AlertDescription>
            {t("policyLoadErrorDescription")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const isComplete = isPolicyComplete(policy);
  const missingFields = getMissingFields(policy);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleBackToWorkflow}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("backToWorkflow")}
        </Button>
        <WorkflowStatusBadge status={policy.workflow_status} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-2">{policy.policy_number}</h1>
              <div className="text-sm text-muted-foreground">
                {policy.insurer_name} | {policy.policyholder_name}
              </div>
              <Separator className="my-4" />
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
                  <TabsTrigger value="edit">{t("edit")}</TabsTrigger>
                  <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4">
                  <PolicyReviewDetails policy={policy} />
                </TabsContent>
                
                <TabsContent value="edit" className="mt-4">
                  <PolicyReviewForm 
                    policy={policy}
                    onSave={(updatedPolicy) => {
                      console.log("Updated policy:", updatedPolicy);
                      // This will be handled via the PolicyReviewForm component
                    }}
                    isProcessing={false}
                  />
                </TabsContent>
                
                <TabsContent value="documents" className="mt-4">
                  <div className="min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground">{t("policyDocuments")}</p>
                      {/* Document functionality will be implemented separately */}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <PolicyReviewActions
                policy={policy}
                isComplete={isComplete}
              />
              
              {missingFields.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-red-600">{t("missingRequiredFields")}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{t("followingFieldsAreRequired")}</p>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {missingFields.map((field) => (
                      <li key={field}>{t(field)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PolicyReview;
