
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useActivityLogger } from "@/utils/activityLogger";
import { Loader2, AlertTriangle, FileUp, CheckCircle } from "lucide-react";
import { parseCSV } from "@/utils/csv";
import { importPolicies } from "@/utils/policies/policyImportUtils";
import PolicyImportInstructions from "./PolicyImportInstructions";
import PolicyImportFileUpload from "./PolicyImportFileUpload";
import PolicyImportReview from "./PolicyImportReview";

interface PolicyImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PolicyImportDialog: React.FC<PolicyImportDialogProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<"instructions" | "file_upload" | "review" | "processing" | "complete">("instructions");
  const [parsedPolicies, setParsedPolicies] = useState<any[]>([]);
  const [importResults, setImportResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);
  
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };
  
  const handleGoToFileUpload = () => {
    setUploadStep("file_upload");
  };
  
  const handleGoBackToInstructions = () => {
    setUploadStep("instructions");
  };
  
  const resetForm = () => {
    setFile(null);
    setParsedPolicies([]);
    setImportResults(null);
    setUploadStep("instructions");
    setIsUploading(false);
  };
  
  const handleReviewPolicies = async () => {
    if (!file) {
      toast({
        title: t("noFileSelected"),
        description: t("pleaseSelectFileToImport"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Read the file content
      const fileContent = await file.text();
      
      // Parse CSV to get policy data
      const policies = await parseCSV(fileContent);
      
      if (policies.length === 0) {
        throw new Error(t("noPoliciesFoundInFile"));
      }
      
      // Store parsed policies for review
      setParsedPolicies(policies);
      
      // Move to review step
      setUploadStep("review");
    } catch (error) {
      console.error("Policy import parse error:", error);
      toast({
        title: t("parseError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleBackToFileUpload = () => {
    setUploadStep("file_upload");
  };
  
  const handleImport = async () => {
    try {
      setIsUploading(true);
      setUploadStep("processing");
      
      // Import the policies
      const result = await importPolicies(parsedPolicies);
      
      // Log activity
      await logActivity({
        entityType: "policy",
        entityId: "batch-import",
        action: "create",
        details: {
          action: "policy_import",
          count: result.successful,
          file_name: file?.name || "unknown"
        }
      });
      
      setImportResults({
        total: parsedPolicies.length,
        successful: result.successful,
        failed: result.failed.length,
        errors: result.failed.map(f => `Row ${f.row}: ${f.reason}`)
      });
      
      setUploadStep("complete");
      
      if (result.successful > 0) {
        toast({
          title: t("importSuccessful"),
          description: t("policiesImportedSuccessfully", { count: result.successful }),
        });
      } else {
        toast({
          title: t("importFailed"),
          description: t("noPoliciesImported"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Policy import error:", error);
      toast({
        title: t("importFailed"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      setUploadStep("review");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDone = () => {
    if (importResults && importResults.successful > 0) {
      onSuccess();
    }
    resetForm();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={isOpen => {
      if (!isOpen) {
        if (!isUploading) {
          resetForm();
          onClose();
        }
      }
    }}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{t("importPolicies")}</DialogTitle>
          <DialogDescription>{t("importPoliciesDescription")}</DialogDescription>
        </DialogHeader>
        
        {uploadStep === "instructions" && (
          <PolicyImportInstructions onContinue={handleGoToFileUpload} />
        )}
        
        {uploadStep === "file_upload" && (
          <PolicyImportFileUpload 
            file={file} 
            onFileChange={handleFileChange} 
            onBack={handleGoBackToInstructions}
            onImport={handleReviewPolicies}
            isLoading={isUploading}
          />
        )}
        
        {uploadStep === "review" && (
          <PolicyImportReview
            policies={parsedPolicies}
            onBack={handleBackToFileUpload}
            onImport={handleImport}
          />
        )}
        
        {uploadStep === "processing" && (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-center">{t("importingPolicies")}</p>
            <p className="text-sm text-muted-foreground text-center">{t("pleaseDoNotCloseThisWindow")}</p>
          </div>
        )}
        
        {uploadStep === "complete" && importResults && (
          <div className="py-4 space-y-4">
            <div className="flex items-center space-x-2 text-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-medium">{t("importComplete")}</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pb-4">
              <div className="bg-slate-50 p-3 rounded-md text-center">
                <p className="text-sm text-muted-foreground">{t("totalPolicies")}</p>
                <p className="text-xl font-semibold">{importResults.total}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-md text-center">
                <p className="text-sm text-green-600">{t("successful")}</p>
                <p className="text-xl font-semibold text-green-700">{importResults.successful}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-md text-center">
                <p className="text-sm text-red-600">{t("failed")}</p>
                <p className="text-xl font-semibold text-red-700">{importResults.failed}</p>
              </div>
            </div>
            
            {importResults.errors.length > 0 && (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  <p className="font-medium mb-1">{t("importErrors")}</p>
                  <ul className="text-xs list-disc ml-5 space-y-1 max-h-40 overflow-y-auto">
                    {importResults.errors.slice(0, 10).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {importResults.errors.length > 10 && (
                      <li>{t("andMoreErrors", { count: importResults.errors.length - 10 })}</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {importResults.successful > 0 && (
              <p className="text-sm text-center text-muted-foreground">
                {t("importedPoliciesInDraft")}
              </p>
            )}
          </div>
        )}
        
        <DialogFooter>
          {uploadStep === "complete" && (
            <Button onClick={handleDone}>{t("done")}</Button>
          )}
          
          {uploadStep !== "complete" && uploadStep !== "processing" && (
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isUploading}
            >
              {t("cancel")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyImportDialog;
