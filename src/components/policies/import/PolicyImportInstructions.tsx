
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle, FileText, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { generatePolicyCSVTemplate } from "@/utils/policies/importUtils";

interface PolicyImportInstructionsProps {
  onContinue?: () => void;
}

const PolicyImportInstructions: React.FC<PolicyImportInstructionsProps> = ({ onContinue }) => {
  const { t } = useLanguage();

  const handleDownloadTemplate = () => {
    const template = generatePolicyCSVTemplate();
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "policy_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>{t("importInstructions")}</AlertTitle>
        <AlertDescription>
          {t("policyImportInstructionsDescription")}
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("fileRequirements")}</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>{t("csvFileFormat")}</li>
          <li>
            {t("dateFormat")}: <code>YYYY-MM-DD</code> (e.g., 2023-12-31)
          </li>
          <li>
            {t("maxPolicyCount")}: 500 {t("perImport")}
          </li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{t("requiredColumns")}</h3>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                  <div>
                    <strong>policy_number</strong>
                    <p className="text-sm text-muted-foreground">Unique identifier for the policy</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                  <div>
                    <strong>insurer_name</strong>
                    <p className="text-sm text-muted-foreground">Insurance company name</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                  <div>
                    <strong>policyholder_name</strong>
                    <p className="text-sm text-muted-foreground">Client name or company</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                  <div>
                    <strong>start_date</strong>
                    <p className="text-sm text-muted-foreground">Policy start date (YYYY-MM-DD)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                  <div>
                    <strong>expiry_date</strong>
                    <p className="text-sm text-muted-foreground">Policy expiry date (YYYY-MM-DD)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                  <div>
                    <strong>premium</strong>
                    <p className="text-sm text-muted-foreground">Premium amount (numeric)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                  <div>
                    <strong>currency</strong>
                    <p className="text-sm text-muted-foreground">Currency code (e.g., EUR, USD)</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{t("optionalColumns")}</h3>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <FileText className="h-4 w-4 text-slate-400 mt-1 mr-2" />
                  <div>
                    <strong>insured_name</strong>
                    <p className="text-sm text-muted-foreground">Name of the insured if different from policyholder</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 text-slate-400 mt-1 mr-2" />
                  <div>
                    <strong>product_name</strong>
                    <p className="text-sm text-muted-foreground">Insurance product name</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 text-slate-400 mt-1 mr-2" />
                  <div>
                    <strong>product_code</strong>
                    <p className="text-sm text-muted-foreground">Insurance product code</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 text-slate-400 mt-1 mr-2" />
                  <div>
                    <strong>payment_frequency</strong>
                    <p className="text-sm text-muted-foreground">How often premium is paid (e.g., annual, monthly)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 text-slate-400 mt-1 mr-2" />
                  <div>
                    <strong>commission_percentage</strong>
                    <p className="text-sm text-muted-foreground">Commission rate as percentage</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 text-slate-400 mt-1 mr-2" />
                  <div>
                    <strong>commission_type</strong>
                    <p className="text-sm text-muted-foreground">Type of commission (automatic or manual)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 text-slate-400 mt-1 mr-2" />
                  <div>
                    <strong>notes</strong>
                    <p className="text-sm text-muted-foreground">Additional information about the policy</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium">{t("importSteps")}</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>{t("downloadTemplateStep")}</li>
          <li>{t("fillTemplateStep")}</li>
          <li>{t("uploadFileStep")}</li>
          <li>{t("reviewPoliciesStep")}</li>
          <li>{t("confirmAndImportStep")}</li>
        </ol>
      </div>

      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("importantNotes")}</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{t("importNoteAutoLinking")}</p>
          <p>{t("importNoteWorkflowStatus")}</p>
          <p>{t("importNoteDuplicates")}</p>
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleDownloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          {t("downloadTemplate")}
        </Button>
        
        {onContinue && (
          <Button onClick={onContinue}>{t("continue")}</Button>
        )}
      </div>
    </div>
  );
};

export default PolicyImportInstructions;
