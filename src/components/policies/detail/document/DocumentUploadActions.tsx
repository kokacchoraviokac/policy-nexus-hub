
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface DocumentUploadActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

const DocumentUploadActions: React.FC<DocumentUploadActionsProps> = ({
  onClose,
  onSubmit,
  isSubmitting,
  isValid
}) => {
  const { t } = useLanguage();

  return (
    <>
      <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
        {t("cancel")}
      </Button>
      <Button 
        type="submit" 
        onClick={onSubmit} 
        disabled={!isValid || isSubmitting}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isSubmitting ? t("uploading") : t("upload")}
      </Button>
    </>
  );
};

export default DocumentUploadActions;
