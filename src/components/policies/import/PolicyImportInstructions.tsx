
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileDown, ArrowRight } from "lucide-react";

interface PolicyImportInstructionsProps {
  onContinue: () => void;
}

const PolicyImportInstructions: React.FC<PolicyImportInstructionsProps> = ({ onContinue }) => {
  const { t } = useLanguage();
  
  const handleDownloadTemplate = () => {
    // Create CSV template content
    const templateContent = [
      "policy_number,policy_type,insurer_name,product_name,policyholder_name,insured_name,start_date,expiry_date,premium,currency,payment_frequency,commission_percentage",
      "POL12345,Non-Life,Insurance Company Ltd,Property Insurance,Client Name Ltd,Client Name Ltd,2023-01-01,2024-01-01,1000,EUR,annual,10",
      "POL12346,Life,Other Insurance Company,Life Insurance,Individual Name,Individual Name,2023-02-01,2024-02-01,500,EUR,monthly,15"
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
      
      <div className="bg-slate-50 p-4 rounded-md space-y-2">
        <h4 className="font-medium">{t("fileRequirements")}</h4>
        <ul className="text-sm space-y-1 list-disc pl-5">
          <li>{t("csvFileFormat")}</li>
          <li>{t("requiredColumns")}: policy_number, insurer_name, policyholder_name, start_date, expiry_date, premium, currency</li>
          <li>{t("optionalColumns")}: policy_type, product_name, insured_name, payment_frequency, commission_percentage</li>
          <li>{t("dateFormat")}: YYYY-MM-DD</li>
          <li>{t("maxPolicyCount")}: 1000 {t("perImport")}</li>
        </ul>
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
