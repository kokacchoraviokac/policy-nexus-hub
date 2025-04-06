
import React, { useEffect, useState } from "react";
import { UploadCloudIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Policy, ValidationErrors } from "@/types/policies";
import { useLanguage } from "@/contexts/LanguageContext";
import FileUploadDropzone from "@/components/ui/file-upload-dropzone";

interface PolicyImportPageProps {
  importedPolicies: Partial<Policy>[];
  invalidPolicies: Array<{ policy: Partial<Policy>; errors: string[] }>;
  validationErrors: ValidationErrors;
  handleFileSelect: (file: File) => Promise<void>;
  handleFileDrop: (acceptedFiles: File[]) => Promise<void>;
  isProcessing: boolean;
  isSubmitting: boolean;
  submitPolicies: () => Promise<boolean>;
}

const PolicyImportPage: React.FC<PolicyImportPageProps> = ({
  importedPolicies,
  invalidPolicies,
  validationErrors,
  handleFileSelect,
  handleFileDrop,
  isProcessing,
  isSubmitting,
  submitPolicies,
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file selection and display file name
  const onFileSelected = (file: File) => {
    setSelectedFile(file);
    if (file) {
      // Process the file
      const processFile = async () => {
        try {
          await handleFileSelect(file);
        } catch (error) {
          console.error("Error processing file:", error);
          toast({
            title: t("errorProcessingFile"),
            description: error instanceof Error ? error.toString() : String(error),
            variant: "destructive",
          });
        }
      };
      
      processFile();
    }
  };

  // Handle file drop
  const onFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      handleFileDrop(acceptedFiles);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const success = await submitPolicies();
    
    if (success) {
      toast({
        title: t("importCompleted"),
        description: t("policiesImportedSuccessfully"),
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">{t("uploadExcelFile")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("uploadExcelFileDescription")}
            </p>
            <FileUploadDropzone
              onFileDrop={onFileDrop}
              onFileSelected={onFileSelected}
              acceptedFileTypes={{
                "application/vnd.ms-excel": [".xls"],
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
                  ".xlsx",
                ],
                "text/csv": [".csv"],
              }}
              isProcessing={isProcessing}
              selectedFile={selectedFile}
              icon={<UploadCloudIcon className="w-10 h-10 mb-2 text-muted-foreground" />}
            />
          </div>
        </CardContent>
      </Card>

      {(importedPolicies.length > 0 || invalidPolicies.length > 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">{t("importSummary")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-muted rounded flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  <span>
                    {t("validPolicies")}: <strong>{importedPolicies.length}</strong>
                  </span>
                </div>
                <div className="p-4 bg-muted rounded flex items-center">
                  <XCircleIcon className="w-5 h-5 text-destructive mr-2" />
                  <span>
                    {t("invalidPolicies")}: <strong>{invalidPolicies.length}</strong>
                  </span>
                </div>
              </div>
            </div>

            {Object.keys(validationErrors).length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">{t("validationErrors")}</h3>
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded">
                  <div className="flex items-start">
                    <AlertTriangleIcon className="w-5 h-5 text-destructive mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">{t("pleaseCorrectFollowingErrors")}</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {Object.entries(validationErrors).map(([field, errors]) => (
                          <li key={field} className="text-sm">
                            <span className="font-medium">{field}:</span>{" "}
                            {Array.isArray(errors) ? errors.join(", ") : errors}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {invalidPolicies.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">{t("invalidPolicies")}</h3>
                <div className="border rounded overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-muted">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          {t("policyNumber")}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          {t("errors")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invalidPolicies.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {item.policy?.policy_number || t("unknown")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-destructive">
                            {Array.isArray(item.errors) ? item.errors.join(", ") : String(item.errors)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {importedPolicies.length > 0 && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⟳</span>
                      {t("importing")}...
                    </span>
                  ) : (
                    t("importPolicies")
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PolicyImportPage;
