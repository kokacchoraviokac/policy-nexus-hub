
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { getMissingFields } from "@/utils/policyWorkflowUtils";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PolicyReviewChecklistProps {
  policy: Policy;
}

const PolicyReviewChecklist: React.FC<PolicyReviewChecklistProps> = ({ policy }) => {
  const { t } = useLanguage();
  const missingFields = getMissingFields(policy);
  const isComplete = missingFields.length === 0;
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{t("reviewChecklist")}</h3>
      <p className="text-sm text-muted-foreground">{t("ensureAllRequiredInformationIsComplete")}</p>
      
      {isComplete ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 text-sm ml-2">
            {t("allRequiredFieldsComplete")}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 text-sm ml-2">
            {t("missingRequiredFields")}
          </AlertDescription>
          <div className="mt-2 text-sm text-red-700">
            <p className="font-medium">{t("followingFieldsAreRequired")}:</p>
            <ul className="list-disc list-inside mt-1">
              {missingFields.map((field) => (
                <li key={field}>{t(field)}</li>
              ))}
            </ul>
          </div>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="border rounded-md p-4 bg-white">
          <h4 className="font-medium mb-2">{t("required")}</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.policy_number ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {t("policyNumber")}
            </li>
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.insurer_name ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {t("insurerName")}
            </li>
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.policyholder_name ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {t("policyholderName")}
            </li>
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.start_date ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {t("startDate")}
            </li>
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.expiry_date ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {t("expiryDate")}
            </li>
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.premium ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {t("premium")}
            </li>
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.currency ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {t("currency")}
            </li>
          </ul>
        </div>
        
        <div className="border rounded-md p-4 bg-white">
          <h4 className="font-medium mb-2">{t("optional")}</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.insured_name ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              {t("insuredName")}
            </li>
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.product_name ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              {t("productName")}
            </li>
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.payment_frequency ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              {t("paymentFrequency")}
            </li>
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.commission_percentage ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              {t("commissionPercentage")}
            </li>
            <li className="flex items-center">
              <span className={`w-4 h-4 rounded-full mr-2 ${policy.notes ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              {t("notes")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PolicyReviewChecklist;
