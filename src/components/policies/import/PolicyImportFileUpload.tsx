
import React, { useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generatePolicyCSVTemplate } from "@/utils/policies/importUtils";
import { Download, Upload, FileSpreadsheet, Loader2, ArrowLeft, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PolicyImportFileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  file?: File | null;
  onFileChange?: (file: File | null) => void;
  onBack?: () => void;
  onImport?: () => Promise<void>;
  isLoading?: boolean;
}

const PolicyImportFileUpload: React.FC<PolicyImportFileUploadProps> = ({
  onFileUpload,
  isUploading,
  file,
  onFileChange,
  onBack,
  onImport,
  isLoading,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(file || null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setSelectedFile(newFile);
      if (onFileChange) onFileChange(newFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        if (onFileChange) onFileChange(file);
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (onFileChange) onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
      {onBack && (
        <Button variant="outline" size="sm" onClick={onBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("back")}
        </Button>
      )}
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription>
          {t("selectCSVFileWithPolicyData")}
        </AlertDescription>
      </Alert>
      
      <div 
        className={`bg-gray-50 border-2 ${dragActive ? 'border-primary' : 'border-dashed border-gray-300'} 
        rounded-lg p-8 text-center transition-colors ${isUploading ? 'opacity-70' : 'hover:border-primary hover:bg-primary/5'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
        <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <div className="text-gray-600 mb-4">{t("dragAndDropOrClick")}</div>
        <p className="text-sm text-gray-500 mb-4">{t("supportedFormatCSV")}</p>
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          disabled={isUploading || isLoading}
          className="mx-auto"
        >
          <Upload className="h-4 w-4 mr-2" />
          {t("browseFiles")}
        </Button>
      </div>

      {selectedFile && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <div className="text-sm font-medium">{selectedFile.name}</div>
                <div className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFile}
                disabled={isUploading || isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                onClick={onImport ? onImport : handleSubmit}
                disabled={isUploading || isLoading}
                size="sm"
              >
                {(isUploading || isLoading) ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {t("upload")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={handleDownloadTemplate}
          className="text-primary"
        >
          <Download className="h-4 w-4 mr-2" />
          {t("downloadTemplate")}
        </Button>
      </div>
    </div>
  );
};

export default PolicyImportFileUpload;
