
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { usePolicyDetail } from "@/hooks/usePolicyDetail";
import PolicyDetailHeader from "@/components/policies/detail/PolicyDetailHeader";
import PolicyDetailTabs from "@/components/policies/detail/PolicyDetailTabs";
import PolicyDetailLoading from "@/components/policies/detail/PolicyDetailLoading";
import PolicyDetailError from "@/components/policies/detail/PolicyDetailError";

const PolicyDetail = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const { data: policy, isLoading, isError, error } = usePolicyDetail(policyId);
  
  const handleBackClick = () => {
    navigate('/policies');
  };
  
  const handleEdit = () => {
    if (policyId) {
      navigate(`/policies/workflow/${policyId}`);
    }
  };
  
  const handleRenew = () => {
    // Placeholder for renew functionality
    console.log("Renew policy:", policyId);
  };
  
  const handleExport = () => {
    // Placeholder for export functionality
    console.log("Export policy:", policyId);
  };
  
  if (isLoading) {
    return <PolicyDetailLoading />;
  }
  
  if (isError || !policy) {
    return <PolicyDetailError error={error} onBackToList={handleBackClick} />;
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
          {t("backToPolicies")}
        </Button>
        
        <div className="flex items-center gap-2">
          {/* Action buttons can be added here */}
        </div>
      </div>
      
      <PolicyDetailHeader 
        policy={policy}
        onEdit={handleEdit}
        onRenew={handleRenew}
        onExport={handleExport}
      />
      <PolicyDetailTabs policy={policy} />
    </div>
  );
};

export default PolicyDetail;
