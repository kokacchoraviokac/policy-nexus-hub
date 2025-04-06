
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePolicyImport } from "@/hooks/usePolicyImport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, FileText, AlertCircle } from "lucide-react";
import PolicyImportFileUpload from "./PolicyImportFileUpload";
import PolicyImportReview from "./PolicyImportReview";
import PolicyImportInstructions from "./PolicyImportInstructions";
import { useNavigate } from "react-router-dom";
import { Policy } from "@/types/policies";

interface PolicyImportReviewData {
  policy: Partial<Policy>;
  errors: string[];
}

const PolicyImportPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("upload");
  const { 
    importedPolicies, 
    validationErrors, 
    handleFileSelect, 
    isProcessing,
    isSubmitting,
    submitPolicies,
    invalidPolicies
  } = usePolicyImport();

  // Convert validation errors to the expected format for PolicyImportReview
  const convertedInvalidPolicies: PolicyImportReviewData[] = invalidPolicies ? 
    invalidPolicies.map(item => ({
      policy: item.policy || {},
      errors: Array.isArray(item.errors) ? item.errors : [String(item.errors || '')]
    })) : 
    Object.entries(validationErrors).map(
      ([index, errors]) => ({
        policy: importedPolicies[parseInt(index, 10)] || {},
        errors
      })
    );

  const handleFileUpload = async (file: File) => {
    await handleFileSelect(file);
    // If we have valid policies, switch to the review tab
    if (importedPolicies.length > 0) {
      setActiveTab("review");
    }
  };

  const handleImportComplete = () => {
    submitPolicies().then(success => {
      if (success) {
        navigate("/policies/workflow");
      }
    });
  };

  const handleCancel = () => {
    navigate("/policies");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Button>
        <h1 className="text-2xl font-bold">{t("policyImport")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("importPolicies")}</CardTitle>
          <CardDescription>
            {t("importPoliciesDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" disabled={isProcessing}>
                <Upload className="h-4 w-4 mr-2" />
                {t("upload")}
              </TabsTrigger>
              <TabsTrigger 
                value="review" 
                disabled={isProcessing || importedPolicies.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                {t("review")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="py-4">
              <PolicyImportInstructions />
              <div className="mt-6">
                <PolicyImportFileUpload 
                  onFileUpload={handleFileUpload} 
                  isUploading={isProcessing} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="review" className="py-4">
              {convertedInvalidPolicies.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">{t("validationWarning")}</h4>
                    <p className="text-sm text-yellow-700">
                      {t("validationWarningDescription", { count: convertedInvalidPolicies.length })}
                    </p>
                  </div>
                </div>
              )}
              
              <PolicyImportReview 
                policies={importedPolicies}
                invalidPolicies={convertedInvalidPolicies}
                onBack={() => setActiveTab("upload")}
                onImport={handleImportComplete}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyImportPage;
