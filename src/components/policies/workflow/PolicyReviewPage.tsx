
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, XCircle, Edit, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WorkflowStatusBadge from "./WorkflowStatusBadge";
import PolicyReviewForm from "./PolicyReviewForm";
import PolicyReviewDetails from "./PolicyReviewDetails";
import { useActivityLogger } from "@/utils/activityLogger";

const PolicyReviewPage: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { t, formatDate, formatCurrency } = useLanguage();
  const { logActivity } = useActivityLogger();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("review");
  
  // Fetch policy data
  const { data: policy, isLoading, error } = useQuery({
    queryKey: ["policy-review", policyId],
    queryFn: async () => {
      if (!policyId) throw new Error("No policy ID provided");
      
      const { data, error } = await supabase
        .from("policies")
        .select("*")
        .eq("id", policyId)
        .single();
      
      if (error) throw error;
      return data as Policy;
    },
    enabled: !!policyId,
  });
  
  // Approve policy mutation
  const approveMutation = useMutation({
    mutationFn: async (updatedPolicy: Partial<Policy>) => {
      if (!policyId) throw new Error("No policy ID provided");
      
      const updateData = {
        ...updatedPolicy,
        workflow_status: "approved",
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from("policies")
        .update(updateData)
        .eq("id", policyId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log activity
      await logActivity({
        entityType: "policy",
        entityId: policyId,
        action: "update",
        details: {
          action_type: "policy_approved",
          previous_status: policy?.workflow_status,
          new_status: "approved",
        }
      });
      
      return data;
    },
    onSuccess: () => {
      toast.success(t("policyApproved"), {
        description: t("policyApprovedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["policy-review", policyId] });
      queryClient.invalidateQueries({ queryKey: ["workflow-policies"] });
      navigate(`/policies/workflow/${policyId}`);
    },
    onError: (error) => {
      toast.error(t("policyApproveError"), {
        description: error instanceof Error ? error.message : t("unknownError"),
      });
    },
  });
  
  // Reject policy mutation
  const rejectMutation = useMutation({
    mutationFn: async (reason: string) => {
      if (!policyId) throw new Error("No policy ID provided");
      
      const updateData = {
        workflow_status: "rejected",
        notes: reason ? `${policy?.notes || ''}\n\nRejection reason: ${reason}` : policy?.notes,
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from("policies")
        .update(updateData)
        .eq("id", policyId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log activity
      await logActivity({
        entityType: "policy",
        entityId: policyId,
        action: "update",
        details: {
          action_type: "policy_rejected",
          previous_status: policy?.workflow_status,
          new_status: "rejected",
          rejection_reason: reason,
        }
      });
      
      return data;
    },
    onSuccess: () => {
      toast.success(t("policyRejected"), {
        description: t("policyRejectedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["policy-review", policyId] });
      queryClient.invalidateQueries({ queryKey: ["workflow-policies"] });
      navigate(`/policies/workflow/${policyId}`);
    },
    onError: (error) => {
      toast.error(t("policyRejectError"), {
        description: error instanceof Error ? error.message : t("unknownError"),
      });
    },
  });
  
  // Update policy mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedPolicy: Partial<Policy>) => {
      if (!policyId) throw new Error("No policy ID provided");
      
      const updateData = {
        ...updatedPolicy,
        workflow_status: "review",
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from("policies")
        .update(updateData)
        .eq("id", policyId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log activity
      await logActivity({
        entityType: "policy",
        entityId: policyId,
        action: "update",
        details: {
          action_type: "policy_updated",
          previous_status: policy?.workflow_status,
          new_status: "review",
        }
      });
      
      return data;
    },
    onSuccess: () => {
      toast.success(t("policyUpdated"), {
        description: t("policyUpdatedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["policy-review", policyId] });
      queryClient.invalidateQueries({ queryKey: ["workflow-policies"] });
      setActiveTab("details");
    },
    onError: (error) => {
      toast.error(t("policyUpdateError"), {
        description: error instanceof Error ? error.message : t("unknownError"),
      });
    },
  });
  
  const handleGoBack = () => {
    navigate("/policies/workflow");
  };
  
  const handleApprove = () => {
    if (!policy) return;
    
    // No changes needed, just approve the current policy
    approveMutation.mutate({});
  };
  
  const handleReject = () => {
    const reason = prompt(t("enterRejectionReason"));
    if (reason !== null) {
      rejectMutation.mutate(reason);
    }
  };
  
  const handleSaveChanges = (updatedPolicy: Partial<Policy>) => {
    updateMutation.mutate(updatedPolicy);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("back")}
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !policy) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("back")}
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("errorLoadingPolicy")}</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : t("unknownError")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const isApprovable = policy.workflow_status === "draft" || policy.workflow_status === "review";
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("back")}
        </Button>
        <WorkflowStatusBadge status={policy.workflow_status} />
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>{policy.policy_number}</CardTitle>
                <CardDescription>
                  {policy.insurer_name} | {formatCurrency(policy.premium, policy.currency)}
                </CardDescription>
              </div>
              {isApprovable && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleReject}
                    disabled={rejectMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {t("reject")}
                  </Button>
                  <Button 
                    onClick={handleApprove}
                    disabled={approveMutation.isPending}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {t("approve")}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-6">
                <TabsTrigger value="review" disabled={!isApprovable}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t("review")}
                </TabsTrigger>
                <TabsTrigger value="details">
                  {t("details")}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="review">
                {isApprovable ? (
                  <PolicyReviewForm 
                    policy={policy} 
                    onSave={handleSaveChanges} 
                    isProcessing={updateMutation.isPending}
                  />
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("reviewNotAvailable")}</AlertTitle>
                    <AlertDescription>
                      {t("policyNotInReviewState")}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="details">
                <PolicyReviewDetails policy={policy} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PolicyReviewPage;
