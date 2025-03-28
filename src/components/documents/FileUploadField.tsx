
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FileUploadFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onChange,
  file
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="file">{t("selectFile")} *</Label>
      <Input
        id="file"
        type="file"
        onChange={onChange}
        className="cursor-pointer"
      />
      {file && (
        <p className="text-xs text-muted-foreground">
          {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </p>
      )}
    </div>
  );
};

export default FileUploadField;
