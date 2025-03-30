
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import ClaimDetailsForm, { ClaimFormValues } from "@/components/claims/forms/ClaimDetailsForm";
import PolicySearchDialog from "@/components/claims/forms/PolicySearchDialog";
import { usePolicySearch } from "@/hooks/claims/usePolicySearch";
import { useClaimFormSubmit } from "@/hooks/claims/useClaimFormSubmit";

const NewClaimPage = () => {
  const [searchParams] = useSearchParams();
  const prefilledPolicyId = searchParams.get("policyId");
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Policy search dialog state and handlers
  const { 
    searchTerm, 
    setSearchTerm, 
    policies, 
    isPoliciesLoading, 
    isDialogOpen, 
    openDialog, 
    closeDialog 
  } = usePolicySearch();

  // Fetch current user for reported_by field
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  // Fetch company ID
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', currentUser.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentUser?.id
  });

  // Form submission logic
  const { createClaim, isSubmitting } = useClaimFormSubmit({ currentUser, userProfile });

  // Default form values
  const defaultValues: ClaimFormValues = {
    policy_id: prefilledPolicyId || "",
    claim_number: "",
    damage_description: "",
    incident_date: new Date().toISOString().split("T")[0],
    claimed_amount: 0,
    deductible: 0,
    status: "in processing",
    notes: "",
  };

  // If policy ID is provided, fetch policy details
  const { data: selectedPolicy } = useQuery({
    queryKey: ['policy-for-claim', defaultValues.policy_id],
    queryFn: async () => {
      const policyId = defaultValues.policy_id;
      if (!policyId) return null;
      
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!defaultValues.policy_id
  });

  const handlePolicySelect = (policyId: string) => {
    defaultValues.policy_id = policyId;
    closeDialog();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const onSubmit = (values: ClaimFormValues) => {
    createClaim(values);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Back button */}
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back")}
      </Button>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">{t("createNewClaim")}</h1>
        <p className="text-muted-foreground">{t("createNewClaimDescription")}</p>
      </div>

      {/* Claim form */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>{t("claimDetails")}</CardTitle>
          <CardDescription>{t("enterClaimInformation")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ClaimDetailsForm
            defaultValues={defaultValues}
            selectedPolicy={selectedPolicy}
            onSubmit={onSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            isFormDisabled={!currentUser || !userProfile}
            openPolicySearch={openDialog}
          />
        </CardContent>
      </Card>

      {/* Policy search dialog */}
      <PolicySearchDialog
        open={isDialogOpen}
        onOpenChange={closeDialog}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        isLoading={isPoliciesLoading}
        policies={policies}
        onPolicySelect={handlePolicySelect}
      />
    </div>
  );
};

export default NewClaimPage;
