
import React, { useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generatePolicyCSVTemplate } from "@/utils/policies/importUtils";
import { Download, Upload, FileSpreadsheet, Loader2, ArrowLeft } from "lucide-react";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setSelectedFile(newFile);
      if (onFileChange) onFileChange(newFile);
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
      if (onImport) onImport();
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
      
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
        <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <div className="text-gray-600 mb-4">{t("dragDropCSV")}</div>
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          disabled={isUploading || isLoading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {t("selectCSVFile")}
        </Button>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between bg-gray-50 rounded-md p-3 border">
          <div className="flex items-center">
            <FileSpreadsheet className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium">{selectedFile.name}</span>
            <span className="text-xs text-gray-500 ml-2">
              ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
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
      )}

      <div className="mt-4 text-center">
        <Button
          type="button"
          variant="link"
          onClick={handleDownloadTemplate}
        >
          <Download className="h-4 w-4 mr-2" />
          {t("downloadTemplate")}
        </Button>
      </div>
    </div>
  );
};

export default PolicyImportFileUpload;
