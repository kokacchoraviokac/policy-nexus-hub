
import React, { useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generatePolicyCSVTemplate } from "@/utils/policies/importUtils";
import { Download, Upload, FileSpreadsheet, Loader2 } from "lucide-react";

interface PolicyImportFileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

const PolicyImportFileUpload: React.FC<PolicyImportFileUploadProps> = ({
  onFileUpload,
  isUploading,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
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
          disabled={isUploading}
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
            onClick={handleSubmit}
            disabled={isUploading}
            size="sm"
          >
            {isUploading ? (
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
