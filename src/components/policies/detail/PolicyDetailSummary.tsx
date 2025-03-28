
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Grid } from "@/components/ui/grid";
import PolicyFinancialCard from "./PolicyFinancialCard";
import PolicyWorkflowCard from "./PolicyWorkflowCard";
import PolicyClaimsCard from "./PolicyClaimsCard";
import PolicyDocumentsCard from "./PolicyDocumentsCard";
import PolicyAddendumCard from "./PolicyAddendumCard";
import { usePolicyAddendums } from "@/hooks/usePolicyAddendums";

interface PolicyDetailSummaryProps {
  policy: any; // Will be properly typed when we have the full schema
}

const PolicyDetailSummary: React.FC<PolicyDetailSummaryProps> = ({ policy }) => {
  const { t } = useLanguage();
  const { addendumCount, getLatestAddendum } = usePolicyAddendums(policy.id);
  const latestAddendum = getLatestAddendum();

  const handleCreateAddendum = () => {
    // This will be handled by the tab implementation
    const addendumTab = document.querySelector('[data-value="addendums"]');
    if (addendumTab instanceof HTMLElement) {
      addendumTab.click();
    }
  };
  
  return (
    <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PolicyFinancialCard
        premium={policy.premium}
        currency={policy.currency}
        startDate={policy.start_date}
        expiryDate={policy.expiry_date}
        paymentFrequency={policy.payment_frequency}
      />
      
      <PolicyWorkflowCard
        status={policy.status}
        workflowStatus={policy.workflow_status}
        updatedAt={policy.updated_at}
      />
      
      <PolicyAddendumCard
        policyId={policy.id}
        onCreateAddendum={handleCreateAddendum}
        addendumCount={addendumCount}
        latestAddendum={latestAddendum}
      />
      
      <PolicyClaimsCard
        policyId={policy.id}
        claimsCount={policy.claims_count}
      />
      
      <PolicyDocumentsCard
        policyId={policy.id}
        documentsCount={policy.documents_count || 0}
      />
    </Grid>
  );
};

export default PolicyDetailSummary;
