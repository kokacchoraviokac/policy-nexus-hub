
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileUp, Loader2 } from "lucide-react";

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
    <div className="flex justify-end space-x-2">
      <Button 
        variant="outline"
        onClick={onClose}
        disabled={isSubmitting}
      >
        {t("cancel")}
      </Button>
      
      <Button
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("uploading")}
          </>
        ) : (
          <>
            <FileUp className="mr-2 h-4 w-4" />
            {t("upload")}
          </>
        )}
      </Button>
    </div>
  );
};

export default DocumentUploadActions;
