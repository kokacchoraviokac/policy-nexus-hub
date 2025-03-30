
import React from "react";
import { X, AlertCircle, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";

interface SelectedPolicyDisplayProps {
  policyId: string;
  selectedPolicy: any | null;
  onClearPolicy: () => void;
  onSearchClick: () => void;
  errorMessage?: string;
}

const SelectedPolicyDisplay = ({
  policyId,
  selectedPolicy,
  onClearPolicy,
  onSearchClick,
  errorMessage,
}: SelectedPolicyDisplayProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>{t("policy")}</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onSearchClick}
        >
          <Search className="mr-2 h-4 w-4" />
          {t("searchPolicy")}
        </Button>
      </div>
      
      {policyId && selectedPolicy ? (
        <div className="border rounded-md p-4">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{selectedPolicy.policy_number}</p>
              <p className="text-sm text-muted-foreground">{selectedPolicy.policyholder_name}</p>
              <p className="text-sm text-muted-foreground">{selectedPolicy.insurer_name}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClearPolicy}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-md p-8 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="font-medium">{t("noPolicySelected")}</p>
          <p className="text-sm text-muted-foreground">{t("searchForPolicyDescription")}</p>
          <Button 
            type="button" 
            variant="outline" 
            className="mt-4"
            onClick={onSearchClick}
          >
            <Search className="mr-2 h-4 w-4" />
            {t("searchPolicy")}
          </Button>
        </div>
      )}
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};

export default SelectedPolicyDisplay;
