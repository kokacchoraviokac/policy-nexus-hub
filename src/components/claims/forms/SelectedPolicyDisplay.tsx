
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText } from "lucide-react";

interface SelectedPolicyDisplayProps {
  policy: any; // The policy object
}

const SelectedPolicyDisplay: React.FC<SelectedPolicyDisplayProps> = ({ policy }) => {
  const { t, formatDate } = useLanguage();

  if (!policy) return null;

  return (
    <div className="border rounded-md p-4 bg-card">
      <div className="flex items-start gap-3">
        <div className="bg-secondary/30 p-2 rounded-md">
          <FileText className="h-5 w-5 text-secondary-foreground" />
        </div>
        
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <span className="text-sm text-muted-foreground">{t("policyNumber")}</span>
              <p className="font-medium">{policy.policy_number}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">{t("policyholder")}</span>
              <p>{policy.policyholder_name}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">{t("insurer")}</span>
              <p>{policy.insurer_name}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">{t("expiry")}</span>
              <p>{formatDate(policy.expiry_date)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedPolicyDisplay;
