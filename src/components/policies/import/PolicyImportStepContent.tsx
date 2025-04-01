
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileSpreadsheet } from "lucide-react";
import PolicyImportFileUpload from "./PolicyImportFileUpload";
import PolicyImportReview from "./PolicyImportReview";
import PolicyImportInstructions from "./PolicyImportInstructions";
import ImportingStep from "./ImportingStep";
import CompleteStep from "./CompleteStep";
import { Policy } from "@/types/policies";

interface ImportSourceText {
  title: string;
  description: string;
  alertTitle?: string;
  alertDescription?: string;
}

interface PolicyImportStepContentProps {
  activeStep: "instructions" | "upload" | "review" | "importing" | "complete";
  importProgress: number;
  importedPolicies: Partial<Policy>[];
  invalidPolicies: { policy: Partial<Policy>; errors: string[] }[];
  salesProcessData: any;
  isImporting: boolean;
  onFileUpload: (file: File) => Promise<void>;
  onBack: () => void;
  onImport: () => Promise<void>;
  onNext: () => void;
  onGoToWorkflow: () => void;
  importSourceText: ImportSourceText;
}

const PolicyImportStepContent: React.FC<PolicyImportStepContentProps> = ({
  activeStep,
  importProgress,
  importedPolicies,
  invalidPolicies,
  salesProcessData,
  isImporting,
  onFileUpload,
  onBack,
  onImport,
  onNext,
  onGoToWorkflow,
  importSourceText
}) => {
  switch (activeStep) {
    case "instructions":
      return (
        <PolicyImportInstructions onContinue={onNext} />
      );
      
    case "upload":
      return (
        <PolicyImportFileUpload 
          onFileUpload={onFileUpload} 
          isUploading={isImporting}
          onBack={onBack}
        />
      );
      
    case "review":
      return (
        <>
          {salesProcessData && importSourceText.alertTitle && importSourceText.alertDescription && (
            <div className="mb-4">
              <Alert className="bg-blue-50 border border-blue-200 rounded-md">
                <FileSpreadsheet className="h-5 w-5 text-blue-500" />
                <AlertTitle className="text-blue-700">
                  {importSourceText.alertTitle}
                </AlertTitle>
                <AlertDescription className="text-blue-600">
                  {importSourceText.alertDescription}
                </AlertDescription>
              </Alert>
            </div>
          )}
          <PolicyImportReview 
            policies={importedPolicies}
            invalidPolicies={invalidPolicies}
            onBack={onBack}
            onImport={onImport}
          />
        </>
      );
      
    case "importing":
      return <ImportingStep importProgress={importProgress} />;
      
    case "complete":
      return (
        <CompleteStep 
          importedPolicies={importedPolicies}
          invalidPolicies={invalidPolicies}
          onGoToWorkflow={onGoToWorkflow}
        />
      );
      
    default:
      return null;
  }
};

export default PolicyImportStepContent;
