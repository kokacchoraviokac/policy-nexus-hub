
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileUp, FileDown, Check, AlertTriangle, CheckCircle } from "lucide-react"; // Added CheckCircle import
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import PolicyImportFileUpload from "@/components/policies/import/PolicyImportFileUpload";
import PolicyImportReview from "@/components/policies/import/PolicyImportReview";
import PolicyImportInstructions from "@/components/policies/import/PolicyImportInstructions";
import { usePolicyImport } from "@/hooks/usePolicyImport";

const PolicyImportPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<"instructions" | "upload" | "review" | "importing" | "complete">("instructions");
  const [importProgress, setImportProgress] = useState(0);
  
  const { 
    isImporting, 
    importedPolicies, 
    invalidPolicies, 
    parseCSVFile, 
    savePolicies, 
    clearImportData 
  } = usePolicyImport();
  
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
    
    // Simulated progress for better UX
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
      setActiveStep("upload");
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
          <PolicyImportReview 
            policies={importedPolicies}
            invalidPolicies={invalidPolicies}
            onBack={handleBack}
            onImport={handleImportComplete}
          />
        );
        
      case "importing":
        return (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <h3 className="text-lg font-semibold">{t("importingPolicies")}</h3>
            <p className="text-sm text-muted-foreground">{t("pleaseDoNotCloseThisWindow")}</p>
            <Progress value={importProgress} className="w-full max-w-md mt-4" />
            <p className="text-sm text-muted-foreground">{importProgress}%</p>
          </div>
        );
        
      case "complete":
        return (
          <div className="flex flex-col items-center justify-center py-10 space-y-6">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">{t("importComplete")}</h3>
            
            <div className="flex flex-col w-full max-w-md space-y-4">
              <Alert variant="success" className="border-green-300 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>{t("successful")}</AlertTitle>
                <AlertDescription>
                  {importedPolicies.length} {t("policiesImportedSuccessfully")}
                </AlertDescription>
              </Alert>
              
              {invalidPolicies.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{t("failed")}</AlertTitle>
                  <AlertDescription>
                    {invalidPolicies.length} {t("policiesFailedToImport")}
                  </AlertDescription>
                </Alert>
              )}
              
              <Alert>
                <AlertTitle>{t("importedPoliciesInDraft")}</AlertTitle>
              </Alert>
            </div>
            
            <Button onClick={handleGoToWorkflow} className="mt-6">
              {t("goToWorkflow")}
            </Button>
          </div>
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
          <h1 className="text-2xl font-bold tracking-tight">{t("importPolicies")}</h1>
          <p className="text-muted-foreground">
            {t("importPoliciesFromInsuranceCompanies")}
          </p>
        </div>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{t("importPolicies")}</CardTitle>
          <CardDescription>
            {t("importPoliciesFromInsuranceCompanies")}
          </CardDescription>
          
          {/* Step indicator */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeStep === "instructions" ? "bg-primary text-primary-foreground" : 
                (activeStep === "upload" || activeStep === "review" || activeStep === "importing" || activeStep === "complete") ? 
                "bg-green-100 text-green-700 border border-green-300" : "bg-muted text-muted-foreground"
              }`}>
                1
              </div>
              <span className="text-xs mt-1">{t("instructions")}</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-muted">
              <div className={`h-full bg-primary ${
                (activeStep === "upload" || activeStep === "review" || activeStep === "importing" || activeStep === "complete") ? "w-full" : "w-0"
              } transition-all duration-300`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeStep === "upload" ? "bg-primary text-primary-foreground" : 
                (activeStep === "review" || activeStep === "importing" || activeStep === "complete") ? 
                "bg-green-100 text-green-700 border border-green-300" : "bg-muted text-muted-foreground"
              }`}>
                2
              </div>
              <span className="text-xs mt-1">{t("upload")}</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-muted">
              <div className={`h-full bg-primary ${
                (activeStep === "review" || activeStep === "importing" || activeStep === "complete") ? "w-full" : "w-0"
              } transition-all duration-300`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeStep === "review" ? "bg-primary text-primary-foreground" : 
                (activeStep === "importing" || activeStep === "complete") ? 
                "bg-green-100 text-green-700 border border-green-300" : "bg-muted text-muted-foreground"
              }`}>
                3
              </div>
              <span className="text-xs mt-1">{t("review")}</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-muted">
              <div className={`h-full bg-primary ${
                (activeStep === "importing" || activeStep === "complete") ? "w-full" : "w-0"
              } transition-all duration-300`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeStep === "complete" ? "bg-green-100 text-green-700 border border-green-300" : 
                "bg-muted text-muted-foreground"
              }`}>
                4
              </div>
              <span className="text-xs mt-1">{t("complete")}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyImportPage;
