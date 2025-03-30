import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileSpreadsheet, Import } from "lucide-react";
import PolicyImportFileUpload from "@/components/policies/import/PolicyImportFileUpload";
import PolicyImportReview from "@/components/policies/import/PolicyImportReview";
import PolicyImportInstructions from "@/components/policies/import/PolicyImportInstructions";
import ImportStepIndicator from "@/components/policies/import/ImportStepIndicator";
import ImportingStep from "@/components/policies/import/ImportingStep";
import CompleteStep from "@/components/policies/import/CompleteStep";
import { usePolicyImport } from "@/hooks/usePolicyImport";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PolicyImportPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState<"instructions" | "upload" | "review" | "importing" | "complete">("instructions");
  const [importProgress, setImportProgress] = useState(0);
  
  const { 
    isImporting, 
    importedPolicies, 
    invalidPolicies, 
    parseCSVFile, 
    savePolicies, 
    clearImportData,
    salesProcessData
  } = usePolicyImport();
  
  useEffect(() => {
    if (salesProcessData && importedPolicies.length > 0) {
      setActiveStep("review");
    }
  }, [salesProcessData, importedPolicies]);
  
  const handleBackToWorkflow = () => {
    navigate("/policies/workflow");
  };
  
  const handleFileUpload = async (file: File) => {
    await parseCSVFile(file);
    if (importedPolicies.length > 0) {
      setActiveStep("review");
    }
  };
  
  const handleImportComplete = async () => {
    setActiveStep("importing");
    
    const progressInterval = setInterval(() => {
      setImportProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 90) {
          clearInterval(progressInterval);
        }
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 200);
    
    const success = await savePolicies();
    clearInterval(progressInterval);
    setImportProgress(100);
    
    setTimeout(() => {
      setActiveStep("complete");
      if (success) {
        toast({
          title: t("importSuccess"),
          description: t("policiesImportedSuccessfully"),
        });
      }
    }, 500);
  };
  
  const handleGoToWorkflow = () => {
    clearImportData();
    navigate("/policies/workflow");
  };
  
  const handleBack = () => {
    if (activeStep === "review") {
      if (salesProcessData) {
        navigate(`/sales/processes`);
      } else {
        setActiveStep("upload");
      }
    } else if (activeStep === "upload") {
      setActiveStep("instructions");
    } else if (activeStep === "complete") {
      clearImportData();
      setActiveStep("instructions");
    }
  };
  
  const handleNext = () => {
    if (activeStep === "instructions") {
      setActiveStep("upload");
    }
  };
  
  const renderStepContent = () => {
    switch (activeStep) {
      case "instructions":
        return (
          <PolicyImportInstructions onContinue={handleNext} />
        );
        
      case "upload":
        return (
          <PolicyImportFileUpload 
            onFileUpload={handleFileUpload} 
            isUploading={isImporting}
            onBack={handleBack}
          />
        );
        
      case "review":
        return (
          <>
            {salesProcessData && (
              <div className="mb-4">
                <Alert className="bg-blue-50 border border-blue-200 rounded-md">
                  <FileSpreadsheet className="h-5 w-5 text-blue-500" />
                  <AlertTitle className="text-blue-700">
                    {t("importingFromSalesProcess")}
                  </AlertTitle>
                  <AlertDescription className="text-blue-600">
                    {t("policyDataPreparedFromSalesProcess")}
                  </AlertDescription>
                </Alert>
              </div>
            )}
            <PolicyImportReview 
              policies={importedPolicies}
              invalidPolicies={invalidPolicies}
              onBack={handleBack}
              onImport={handleImportComplete}
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
            onGoToWorkflow={handleGoToWorkflow}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={handleBackToWorkflow}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToPoliciesWorkflow")}
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {salesProcessData 
              ? t("importPolicyFromSalesProcess") 
              : t("importPolicies")}
          </h1>
          <p className="text-muted-foreground">
            {salesProcessData
              ? t("importPolicyFromSalesProcessDescription") 
              : t("importPoliciesFromInsuranceCompanies")}
          </p>
        </div>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            {salesProcessData 
              ? t("importPolicyFromSalesProcess") 
              : t("importPolicies")}
          </CardTitle>
          <CardDescription>
            {salesProcessData
              ? t("reviewAndImportPolicyFromSalesProcess") 
              : t("importPoliciesFromInsuranceCompanies")}
          </CardDescription>
          
          <ImportStepIndicator activeStep={activeStep} />
        </CardHeader>
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyImportPage;
