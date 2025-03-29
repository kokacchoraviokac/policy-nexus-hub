
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Upload, FileUp, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PolicyImportFileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onBack: () => void;
  onImport: () => void;
}

const PolicyImportFileUpload: React.FC<PolicyImportFileUploadProps> = ({
  file,
  onFileChange,
  onBack,
  onImport
}) => {
  const { t } = useLanguage();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files.length > 0 
      ? e.target.files[0] 
      : null;
    
    onFileChange(selectedFile);
  };
  
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t("selectPolicyImportFile")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("selectCSVFileWithPolicyData")}
        </p>
      </div>
      
      {/* File upload area */}
      <div 
        className={`
          border-2 border-dashed rounded-lg p-8
          flex flex-col items-center justify-center space-y-4
          ${file ? 'border-primary bg-primary/5' : 'border-gray-300'}
          hover:border-primary hover:bg-primary/5 transition-colors
          cursor-pointer
        `}
        onClick={handleBrowseClick}
      >
        <div className={`rounded-full p-3 ${file ? 'bg-primary/20' : 'bg-slate-100'}`}>
          <FileUp className={`h-6 w-6 ${file ? 'text-primary' : 'text-slate-400'}`} />
        </div>
        
        <div className="text-center">
          {file ? (
            <>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">{t("dragAndDropOrClick")}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("supportedFormatCSV")}
              </p>
            </>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv"
          onChange={handleFileChange}
        />
        
        <Button 
          type="button" 
          size="sm"
          variant={file ? "secondary" : "outline"}
          onClick={(e) => {
            e.stopPropagation();
            handleBrowseClick();
          }}
        >
          {file ? t("changeFile") : t("browseFiles")}
        </Button>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-800 text-sm">
          {t("importedPoliciesWillBeInDraft")}
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Button>
        
        <Button 
          onClick={onImport}
          className="flex items-center gap-2"
          disabled={!file}
        >
          <Upload className="h-4 w-4" />
          {t("importPolicies")}
        </Button>
      </div>
    </div>
  );
};

export default PolicyImportFileUpload;
