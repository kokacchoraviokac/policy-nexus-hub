
import React, { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface PolicyImportFileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  onBack?: () => void;
}

const PolicyImportFileUpload: React.FC<PolicyImportFileUploadProps> = ({
  onFileUpload,
  isUploading,
  onBack
}) => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv', '.xls', '.xlsm', '.xlsb'],
      'text/plain': ['.csv', '.txt'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false,
    disabled: isUploading
  });
  
  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };
  
  const handleChangeFile = () => {
    setSelectedFile(null);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-2">{t("selectPolicyImportFile")}</h3>
      <p className="text-sm text-muted-foreground mb-6">
        {t("selectCSVFileWithPolicyData")}
      </p>
      
      {!selectedFile ? (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
                ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 hover:bg-accent'}
              `}
            >
              <input {...getInputProps()} />
              <FileUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">{t("dragAndDropOrClick")}</h4>
              <p className="text-sm text-muted-foreground mb-2">{t("supportedFormatCSVExcel")}</p>
              
              <Button 
                type="button"
                variant="secondary"
                disabled={isUploading}
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('file-input')?.click();
                }}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("uploading")}
                  </>
                ) : (
                  t("browseFiles")
                )}
              </Button>
              <input
                id="file-input"
                type="file"
                accept=".csv,.xlsx,.xls,.xlsm,.xlsb"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center p-6 text-center">
              <FileUp className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-lg font-medium mb-2">{selectedFile.name}</h4>
              <p className="text-sm text-muted-foreground mb-6">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={handleChangeFile}
                  disabled={isUploading}
                >
                  {t("changeFile")}
                </Button>
                
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("uploading")}
                    </>
                  ) : (
                    t("upload")
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {onBack && (
        <div className="flex justify-start mt-4">
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isUploading}
          >
            {t("back")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PolicyImportFileUpload;
