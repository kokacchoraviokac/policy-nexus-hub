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
import PolicyImportColumnMapping from "@/components/policies/import/PolicyImportColumnMapping";
import ImportStepIndicator from "@/components/policies/import/ImportStepIndicator";
import ImportingStep from "@/components/policies/import/ImportingStep";
import CompleteStep from "@/components/policies/import/CompleteStep";
import { usePolicyImport } from "@/hooks/usePolicyImport";
import { parsePolicyFile, applyColumnMapping, validateImportedPolicies } from "@/utils/policies/importUtils";
import { createSampleFile } from "@/utils/policies/testDataGenerator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PolicyImportPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState<"instructions" | "upload" | "mapping" | "review" | "importing" | "complete">("instructions");
  const [importProgress, setImportProgress] = useState(0);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  
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
    // Check if we're coming from a quote selection
    const state = location.state as any;
    if (state?.fromQuote && state?.salesProcessId) {
      console.log("Importing policy from quote selection:", state);
      
      // Simulate receiving policy data from insurer after quote acceptance
      // In a real app, this would be actual policy data sent by the insurer
      const mockPolicyData = {
        salesProcessId: state.salesProcessId,
        policyNumber: `POL-${Date.now()}`,
        insurerName: "Selected Insurance Company",
        premium: 1250.00,
        currency: "EUR",
        startDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        coverageDetails: "Comprehensive coverage as per selected quote",
        status: "imported_from_quote"
      };
      
      // Skip to review step with pre-filled data
      setActiveStep("review");
      
      toast({
        title: t("policyReceivedFromInsurer"),
        description: t("reviewPolicyBeforeImporting"),
      });
    } else if (salesProcessData && importedPolicies.length > 0) {
      setActiveStep("review");
    }
  }, [salesProcessData, importedPolicies, location.state, t, toast]);
  
  const handleBackToWorkflow = () => {
    navigate("/policies/workflow");
  };
  
  const handleFileUpload = async (file: File) => {
    try {
      console.log("Starting file upload for:", file.name, "Type:", file.type, "Size:", file.size);

      // Clear any previous error
      setUploadError(null);

      const result = await parsePolicyFile(file);
      console.log("Parse result:", result);

      if (!result.data || result.data.length === 0) {
        console.error("No data found in file");
        const errorMessage = t("noDataFoundInFile") || "No data found in the uploaded file. Please ensure your file contains policy data rows.";
        setUploadError(errorMessage);
        toast({
          title: t("error"),
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      if (!result.headers || result.headers.length === 0) {
        console.error("No headers found in file");
        const errorMessage = t("noHeadersFoundInFile") || "No headers found in the uploaded file. Please ensure your file has column headers.";
        setUploadError(errorMessage);
        toast({
          title: t("error"),
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      setParsedData(result.data);
      setParsedHeaders(result.headers);

      console.log("Moving to mapping step with data:", result.data.length, "rows and", result.headers.length, "headers");
      setActiveStep("mapping");

    } catch (error) {
      console.error("Error parsing file:", error);
      const errorMessage = `${t("errorParsingFile") || "Error parsing file"}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setUploadError(errorMessage);
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleMappingComplete = (mapping: Record<string, string>) => {
    setColumnMapping(mapping);

    // Apply column mapping to the data
    const mappedData = applyColumnMapping(parsedData, mapping);

    // Validate the mapped data
    const { valid, invalid } = validateImportedPolicies(mappedData);

    // Update the imported policies state (this will be used by the hook)
    // For now, we'll set the state directly, but ideally this should go through the hook
    setActiveStep("review");
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
    // Clear any upload errors when navigating
    setUploadError(null);

    if (activeStep === "review") {
      if (salesProcessData) {
        navigate(`/sales/processes`);
      } else {
        setActiveStep("mapping");
      }
    } else if (activeStep === "mapping") {
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
          <div className="space-y-4">
            {uploadError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTitle className="text-red-700">
                  {t("uploadError") || "Upload Error"}
                </AlertTitle>
                <AlertDescription className="text-red-600">
                  {uploadError}
                </AlertDescription>
              </Alert>
            )}

            <PolicyImportFileUpload
              onFileUpload={handleFileUpload}
              isUploading={isImporting}
              onBack={handleBack}
            />

            {/* Test button for debugging */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  const sampleFile = createSampleFile();
                  handleFileUpload(sampleFile);
                }}
                disabled={isImporting}
              >
                Test with Sample Excel File
              </Button>
            </div>
          </div>
        );

      case "mapping":
        console.log("Rendering mapping step with:", { parsedHeaders, parsedData });
        return (
          <PolicyImportColumnMapping
            headers={parsedHeaders}
            sampleData={parsedData.slice(0, 3)} // Show first 3 rows as sample
            onMappingComplete={handleMappingComplete}
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
