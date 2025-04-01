
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePolicyImport } from "@/hooks/usePolicyImport";
import { useImportSourceText } from "@/hooks/policies/useImportSourceText";
import ImportStepIndicator from "@/components/policies/import/ImportStepIndicator";
import PolicyImportHeader from "@/components/policies/import/PolicyImportHeader";
import PolicyImportStepContent from "@/components/policies/import/PolicyImportStepContent";

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
  
  const importSourceText = useImportSourceText(salesProcessData);
  
  useEffect(() => {
    // If we have data from sales process and importedPolicies exist, go directly to review
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
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PolicyImportHeader 
        title={importSourceText.title}
        description={importSourceText.description}
        onBackToWorkflow={handleBackToWorkflow}
      />
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            {importSourceText.title}
          </CardTitle>
          <CardDescription>
            {importSourceText.description}
          </CardDescription>
          
          <ImportStepIndicator activeStep={activeStep} />
        </CardHeader>
        <CardContent className="pt-6">
          <PolicyImportStepContent
            activeStep={activeStep}
            importProgress={importProgress}
            importedPolicies={importedPolicies}
            invalidPolicies={invalidPolicies}
            salesProcessData={salesProcessData}
            isImporting={isImporting}
            onFileUpload={handleFileUpload}
            onBack={handleBack}
            onImport={handleImportComplete}
            onNext={handleNext}
            onGoToWorkflow={handleGoToWorkflow}
            importSourceText={importSourceText}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyImportPage;
