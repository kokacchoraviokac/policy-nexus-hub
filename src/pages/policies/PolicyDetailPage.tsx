
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { usePolicyDetail } from "@/hooks/usePolicyDetail";
import { supabase } from "@/integrations/supabase/client";
import BackToPoliciesButton from "@/components/policies/detail/BackToPoliciesButton";
import PolicyDetailHeader from "@/components/policies/detail/PolicyDetailHeader";
import PolicyDetailSummary from "@/components/policies/detail/PolicyDetailSummary";
import PolicyDetailTabs from "@/components/policies/detail/PolicyDetailTabs";
import PolicyDetailLoading from "@/components/policies/detail/PolicyDetailLoading";
import PolicyDetailError from "@/components/policies/detail/PolicyDetailError";
import { useLanguage } from "@/contexts/LanguageContext";

const PolicyDetailPage = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: policy, isLoading, isError, error } = usePolicyDetail(policyId);
  
  // Get active claims and total claimed amount
  const { data: claimsStats } = useQuery({
    queryKey: ['policy-claims-stats', policyId],
    queryFn: async () => {
      if (!policyId) return { activeClaimsCount: 0, totalClaimedAmount: 0 };
      
      const { data: claims, error } = await supabase
        .from('claims')
        .select('status, claimed_amount')
        .eq('policy_id', policyId);
      
      if (error) throw error;
      
      const activeStatuses = ['in processing', 'reported', 'appealed'];
      const activeClaimsCount = claims.filter(claim => 
        activeStatuses.includes(claim.status.toLowerCase())
      ).length;
      
      const totalClaimedAmount = claims.reduce((sum, claim) => 
        sum + (claim.claimed_amount || 0), 0
      );
      
      return {
        activeClaimsCount,
        totalClaimedAmount
      };
    },
    enabled: !!policyId
  });

  const handleEditPolicy = () => {
    if (policyId) {
      navigate(`/policies/${policyId}/edit`);
    }
  };

  const handleRenewPolicy = () => {
    // To be implemented
    toast({
      title: t("renewalInitiated"),
      description: t("policyRenewalInProgress"),
    });
  };

  const handleExportPolicy = () => {
    // To be implemented
    toast({
      title: t("exportStarted"),
      description: t("policyExportInProgress"),
    });
  };

  const handleBackToList = () => {
    navigate("/policies");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BackToPoliciesButton onClick={handleBackToList} />
      
      {isLoading ? (
        <PolicyDetailLoading />
      ) : isError || !policy ? (
        <PolicyDetailError error={error instanceof Error ? error : undefined} onBackToList={handleBackToList} />
      ) : (
        <>
          <PolicyDetailHeader 
            policy={policy}
            onEdit={handleEditPolicy}
            onRenew={handleRenewPolicy}
            onExport={handleExportPolicy}
          />
          
          <PolicyDetailSummary policy={policy} />
          
          <PolicyDetailTabs 
            policy={policy}
          />
        </>
      )}
    </div>
  );
};

export default PolicyDetailPage;
