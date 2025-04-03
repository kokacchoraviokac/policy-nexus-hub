
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import PolicyForm from "@/components/policies/PolicyForm";

const NewPolicy = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/policies");
  };

  const handleSuccess = (policyId: string) => {
    // After successful creation, navigate to the policy details page
    navigate(`/policies/${policyId}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/policies")}
          aria-label={t("back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("newPolicy")}</h1>
          <p className="text-muted-foreground">
            {t("newPolicyDescription")}
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-border p-6">
        <PolicyForm onCancel={handleCancel} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default NewPolicy;
