import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileDown, ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PolicyImportInstructionsProps {
  onContinue: () => void;
}

const PolicyImportInstructions: React.FC<PolicyImportInstructionsProps> = ({ onContinue }) => {
  const { t } = useLanguage();
  
  const handleDownloadTemplate = () => {
    // Create CSV template content with improved example data
    const templateContent = [
      "policy_number,policy_type,insurer_name,product_name,product_code,policyholder_name,insured_name,start_date,expiry_date,premium,currency,payment_frequency,commission_percentage,notes",
      "POL12345,Non-Life,Insurance Company Ltd,Property Insurance,PROP001,Client Name Ltd,Client Name Ltd,2023-01-01,2024-01-01,1000,EUR,annual,10,Example property insurance policy",
      "POL12346,Life,Other Insurance Company,Life Insurance,LIFE001,Individual Name,Individual Name,2023-02-01,2024-02-01,500,EUR,monthly,15,Example life insurance policy"
    ].join("\n");
    
    // Create a Blob with the CSV content
    const blob = new Blob([templateContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create a link and click it to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "policy_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t("importInstructions")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("policyImportInstructionsDescription")}
        </p>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          {t("importedPoliciesWillBeInDraft")}
        </AlertDescription>
      </Alert>
      
      <div className="bg-slate-50 p-4 rounded-md space-y-2">
        <h4 className="font-medium">{t("fileRequirements")}</h4>
        <ul className="text-sm space-y-1 list-disc pl-5">
          <li>{t("csvFileFormat")}</li>
          <li>
            <span className="font-medium">{t("requiredColumns")}:</span> policy_number, insurer_name, policyholder_name, start_date, expiry_date, premium, currency
          </li>
          <li>
            <span className="font-medium">{t("optionalColumns")}:</span> policy_type, product_name, product_code, insured_name, payment_frequency, commission_percentage, notes
          </li>
          <li>{t("dateFormat")}: YYYY-MM-DD (e.g., 2023-12-31)</li>
          <li>{t("maxPolicyCount")}: 1000 {t("perImport")}</li>
        </ul>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">{t("importSteps")}</h4>
        <ol className="text-sm space-y-1 list-decimal pl-5">
          <li>{t("downloadTemplateStep")}</li>
          <li>{t("fillTemplateStep")}</li>
          <li>{t("uploadFileStep")}</li>
          <li>{t("reviewResultsStep")}</li>
        </ol>
      </div>
      
      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleDownloadTemplate}
        >
          <FileDown className="h-4 w-4" />
          {t("downloadTemplate")}
        </Button>
        
        <Button 
          onClick={onContinue}
          className="flex items-center gap-2"
        >
          {t("continue")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PolicyImportInstructions;
