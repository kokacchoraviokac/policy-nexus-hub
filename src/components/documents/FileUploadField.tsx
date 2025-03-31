
import React, { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Upload, X, File } from "lucide-react";

interface FileUploadFieldProps {
  onChange: (file: File | null) => void;
  file: File | null;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onChange,
  file
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onChange(files[0]);
    }
  };
  
  const handleClearFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{t("file")} *</label>
      
      {!file ? (
        <div
          className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={handleClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="font-medium">{t("dropFileHere")}</p>
          <p className="text-sm text-muted-foreground mb-2">
            {t("orClickToBrowse")}
          </p>
          <Button type="button" variant="secondary" size="sm">
            {t("selectFile")}
          </Button>
        </div>
      ) : (
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearFile}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t("remove")}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadField;
