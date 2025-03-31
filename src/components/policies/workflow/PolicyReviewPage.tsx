
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { getMissingFields, isPolicyComplete } from "@/utils/policyWorkflowUtils";
import { ArrowLeft, Info, AlertTriangle, Loader2 } from "lucide-react";
import PolicyDetailsForm from "./PolicyDetailsForm";
import PolicyDocumentsTab from "./PolicyDocumentsTab";
import PolicyReviewActions from "./PolicyReviewActions";
import PolicyReviewOverview from "./PolicyReviewOverview";

const PolicyReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [documentsComplete, setDocumentsComplete] = useState(false);
  
  // Fetch policy data
  const { data: policy, isLoading, error } = useQuery({
    queryKey: ['policy', id],
    queryFn: async () => {
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
  
  // Determine if policy has all required information
  const isComplete = policy ? isPolicyComplete(policy) : false;
  const missingFields = policy ? getMissingFields(policy) : [];
  
  const handleDocumentsComplete = (complete: boolean) => {
    setDocumentsComplete(complete);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  if (error || !policy) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("policyLoadError")}
            <p className="text-sm mt-2">{t("policyLoadErrorDescription")}</p>
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => navigate('/policies/workflow')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToWorkflow")}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/policies/workflow')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToWorkflow")}
        </Button>
        <h1 className="text-2xl font-bold">{t("reviewPolicy")}</h1>
      </div>
      
      {/* Policy Information Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">
              {policy.policy_number} - {policy.policyholder_name}
            </h3>
            <p className="text-sm text-blue-700">
              {t("importedPolicyReviewNote")}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("editPolicyDetails")}</CardTitle>
              <CardDescription>{t("reviewAndEditImportedPolicy")}</CardDescription>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
                  <TabsTrigger value="edit">{t("edit")}</TabsTrigger>
                  <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="p-6">
              <TabsContent value="overview" className="mt-0">
                <PolicyReviewOverview policy={policy} />
              </TabsContent>
              
              <TabsContent value="edit" className="mt-0">
                <PolicyDetailsForm policy={policy} />
              </TabsContent>
              
              <TabsContent value="documents" className="mt-0">
                <PolicyDocumentsTab 
                  policyId={policy.id}
                  isComplete={documentsComplete}
                  onCompleteChange={handleDocumentsComplete}
                />
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("workflowStatus")}</CardTitle>
              <CardDescription>{t("manageWorkflowStatusOfPolicy")}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">
                  {t("currentStatus")}:
                </p>
                <div className="font-medium">
                  {t(policy.workflow_status.replace('_', ''))}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {!isComplete && (
                <Alert variant="warning" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {t("missingRequiredFields")}
                    <ul className="mt-2 list-disc list-inside text-sm">
                      {missingFields.map((field) => (
                        <li key={field}>{t(field)}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              <PolicyReviewActions 
                policy={policy} 
                isComplete={isComplete && documentsComplete}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PolicyReviewPage;
