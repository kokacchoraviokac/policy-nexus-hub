
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  ArrowLeft, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2,
  ClipboardList,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePolicyWorkflow } from "@/hooks/usePolicyWorkflow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PolicyOverviewTab from "@/components/policies/detail/PolicyOverviewTab";
import PolicyDocumentsTab from "@/components/policies/detail/PolicyDocumentsTab";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PolicyReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { 
    policy, 
    isLoading, 
    error, 
    advanceWorkflow, 
    isUpdating 
  } = usePolicyWorkflow(id);
  
  const getWorkflowStepDescription = (status: string): string => {
    switch (status) {
      case "draft":
        return t("draftStageDescription");
      case "in_review":
        return t("inReviewStageDescription");
      case "ready":
        return t("readyStageDescription");
      case "complete":
        return t("completeStageDescription");
      default:
        return "";
    }
  };
  
  const getWorkflowActionLabel = (status: string): string => {
    switch (status) {
      case "draft":
        return t("moveToReview");
      case "in_review":
        return t("markAsReady");
      case "ready":
        return t("complete");
      default:
        return t("complete");
    }
  };
  
  const getWorkflowStatusBadge = (status: string) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline">{t("draft")}</Badge>;
      case 'in_review':
        return <Badge variant="secondary">{t("inReview")}</Badge>;
      case 'ready':
        return <Badge variant="success">{t("ready")}</Badge>;
      case 'complete':
        return <Badge variant="default">{t("complete")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleBackToWorkflow = () => {
    navigate("/policies/workflow");
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToWorkflow}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToWorkflow")}
        </Button>
        
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">{t("loadingPolicy")}</p>
        </div>
      </div>
    );
  }
  
  if (error || !policy) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToWorkflow}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToWorkflow")}
        </Button>
        
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>{t("policyLoadError")}</CardTitle>
            </div>
            <CardDescription>{t("policyLoadErrorDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>
              {t("retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        size="sm"
        onClick={handleBackToWorkflow}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToWorkflow")}
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("reviewPolicy")}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground">
              {policy.policy_number}
            </span>
            {getWorkflowStatusBadge(policy.workflow_status)}
          </div>
        </div>
        
        {policy.workflow_status !== "complete" && (
          <Button 
            onClick={advanceWorkflow}
            disabled={isUpdating}
            className="mt-2 sm:mt-0"
          >
            {isUpdating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            {getWorkflowActionLabel(policy.workflow_status)}
          </Button>
        )}
      </div>
      
      <Alert className="mb-6">
        <ClipboardList className="h-4 w-4" />
        <AlertTitle>{t("importedPolicyReviewNote")}</AlertTitle>
        <AlertDescription>
          {getWorkflowStepDescription(policy.workflow_status)}
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="px-6 py-4 border-b">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
                  <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-6">
              <TabsContent value="overview">
                <PolicyOverviewTab policy={policy} />
              </TabsContent>
              <TabsContent value="documents">
                <PolicyDocumentsTab policyId={policy.id} />
              </TabsContent>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>{t("workflowActions")}</CardTitle>
              <CardDescription>
                {t("manageWorkflowStatusOfPolicy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">{t("workflowStages")}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("policyWorkflowStagesDescription")}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant={policy.workflow_status === "draft" ? "default" : "outline"}>
                          1
                        </Badge>
                        <span>{t("draft")}</span>
                      </div>
                      
                      {policy.workflow_status === "draft" && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                      {policy.workflow_status !== "draft" && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant={policy.workflow_status === "in_review" ? "default" : "outline"}>
                          2
                        </Badge>
                        <span>{t("inReview")}</span>
                      </div>
                      
                      {policy.workflow_status === "in_review" && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                      {policy.workflow_status !== "in_review" && policy.workflow_status !== "draft" && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant={policy.workflow_status === "ready" ? "default" : "outline"}>
                          3
                        </Badge>
                        <span>{t("ready")}</span>
                      </div>
                      
                      {policy.workflow_status === "ready" && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                      {policy.workflow_status === "complete" && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant={policy.workflow_status === "complete" ? "default" : "outline"}>
                          4
                        </Badge>
                        <span>{t("complete")}</span>
                      </div>
                      
                      {policy.workflow_status === "complete" && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {policy.workflow_status !== "complete" && (
                  <Button 
                    onClick={advanceWorkflow}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    {getWorkflowActionLabel(policy.workflow_status)}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/policies/${policy.id}`)}
                >
                  {t("viewPolicyDetails")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PolicyReviewPage;
