
import React from "react";
import { FileText, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyDocumentListProps {
  onUpload: () => void;
}

const EmptyDocumentList: React.FC<EmptyDocumentListProps> = ({ onUpload }) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">{t("noDocumentsFound")}</h3>
      <p className="text-muted-foreground mt-2">{t("uploadFirstDocument")}</p>
      <Button className="mt-4" onClick={onUpload}>
        <FilePlus className="mr-2 h-4 w-4" />
        {t("uploadDocument")}
      </Button>
    </div>
  );
};

export default EmptyDocumentList;
