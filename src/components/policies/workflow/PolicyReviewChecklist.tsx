
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Policy } from "@/types/policies";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface PolicyReviewChecklistProps {
  policy: Policy;
}

const PolicyReviewChecklist: React.FC<PolicyReviewChecklistProps> = ({ policy }) => {
  const { t } = useLanguage();
  
  // Define required fields for a complete policy
  const requiredFields = [
    { 
      key: 'policy_number', 
      label: t('policyNumber'),
      complete: !!policy.policy_number 
    },
    { 
      key: 'insurer_name', 
      label: t('insurer'),
      complete: !!policy.insurer_name 
    },
    { 
      key: 'policyholder_name', 
      label: t('policyholder'),
      complete: !!policy.policyholder_name 
    },
    { 
      key: 'start_date', 
      label: t('startDate'),
      complete: !!policy.start_date 
    },
    { 
      key: 'expiry_date', 
      label: t('expiryDate'),
      complete: !!policy.expiry_date 
    },
    { 
      key: 'premium', 
      label: t('premium'),
      complete: policy.premium > 0 
    },
    { 
      key: 'currency', 
      label: t('currency'),
      complete: !!policy.currency 
    },
  ];
  
  const optionalFields = [
    { 
      key: 'commission_percentage', 
      label: t('commissionPercentage'),
      complete: policy.commission_percentage !== null && policy.commission_percentage !== undefined
    },
    { 
      key: 'product_name', 
      label: t('product'),
      complete: !!policy.product_name 
    },
    { 
      key: 'insured_name', 
      label: t('insured'),
      complete: !!policy.insured_name 
    },
    { 
      key: 'payment_frequency', 
      label: t('paymentFrequency'),
      complete: !!policy.payment_frequency 
    },
  ];
  
  const missingFields = requiredFields.filter(field => !field.complete);
  const isComplete = missingFields.length === 0;
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{t("reviewChecklist")}</h3>
      <p className="text-sm text-muted-foreground">{t("ensureAllRequiredInformationIsComplete")}</p>
      
      {!isComplete && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle className="flex items-center">
            <XCircle className="h-4 w-4 mr-2" />
            {t("missingRequiredFields")}
          </AlertTitle>
          <AlertDescription>
            {t("followingFieldsAreRequired")}:
            <ul className="mt-2 ml-6 list-disc">
              {missingFields.map(field => (
                <li key={field.key}>{field.label}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border rounded-md divide-y">
        <div className="p-4">
          <h4 className="font-medium mb-2">{t("required")}</h4>
          <ul className="space-y-2">
            {requiredFields.map((field) => (
              <li key={field.key} className="flex items-center justify-between">
                <span>{field.label}</span>
                {field.complete ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4">
          <h4 className="font-medium mb-2">{t("optional")}</h4>
          <ul className="space-y-2">
            {optionalFields.map((field) => (
              <li key={field.key} className="flex items-center justify-between">
                <span>{field.label} ({t("optional")})</span>
                {field.complete ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-amber-500" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PolicyReviewChecklist;
