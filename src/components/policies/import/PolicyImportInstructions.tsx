
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { generatePolicyImportTemplate } from "@/utils/policies/importUtils";
import { Card, CardContent } from "@/components/ui/card";
import { FileDown, CheckCircle, AlertTriangle } from "lucide-react";

interface PolicyImportInstructionsProps {
  onContinue?: () => void;
}

const PolicyImportInstructions: React.FC<PolicyImportInstructionsProps> = ({ onContinue }) => {
  const { t } = useLanguage();
  
  const handleDownloadTemplate = () => {
    const csvContent = generatePolicyImportTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'policy_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">{t("importInstructions")}</h3>
        <p className="text-sm text-muted-foreground mb-6">
          {t("policyImportInstructionsDescription")}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">{t("fileRequirements")}</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>{t("csvFileFormat")}</li>
              <li>{t("dateFormat")}: <code>YYYY-MM-DD</code></li>
              <li>{t("maxPolicyCount")}: 100 {t("perImport")}</li>
            </ul>
            
            <div className="mt-4">
              <h5 className="font-medium text-sm">{t("requiredColumns")}:</h5>
              <ul className="list-disc pl-5 text-sm mt-1">
                <li>policy_number</li>
                <li>insurer_name</li>
                <li>policyholder_name</li>
                <li>start_date</li>
                <li>expiry_date</li>
                <li>premium</li>
                <li>currency</li>
              </ul>
            </div>
            
            <div className="mt-4">
              <h5 className="font-medium text-sm">{t("optionalColumns")}:</h5>
              <ul className="list-disc pl-5 text-sm mt-1">
                <li>policy_type</li>
                <li>product_name</li>
                <li>product_code</li>
                <li>insured_name</li>
                <li>payment_frequency</li>
                <li>commission_percentage</li>
                <li>commission_type</li>
                <li>notes</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">{t("importSteps")}</h4>
            <ol className="list-decimal pl-5 space-y-3 text-sm">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>{t("downloadTemplateStep")}</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>{t("fillTemplateStep")}</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>{t("uploadFileStep")}</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>{t("reviewPoliciesStep")}</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>{t("confirmAndImportStep")}</span>
              </li>
            </ol>
            
            <div className="mt-6 space-y-2">
              <h4 className="font-medium">{t("importantNotes")}</h4>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p>{t("importNoteWorkflowStatus")}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p>{t("importNoteAutoLinking")}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p>{t("importNoteDuplicates")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button
          onClick={handleDownloadTemplate}
          variant="outline"
          className="flex items-center gap-1"
        >
          <FileDown className="h-4 w-4" />
          {t("downloadTemplate")}
        </Button>
        
        {onContinue && (
          <Button onClick={onContinue}>
            {t("continue")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PolicyImportInstructions;
