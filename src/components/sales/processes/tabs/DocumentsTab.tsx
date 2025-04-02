
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesProcess } from "@/types/salesProcess";
import DocumentList from "@/components/documents/unified/DocumentList";

interface DocumentsTabProps {
  process: SalesProcess;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ process }) => {
  const { t } = useLanguage();
  
  return (
    <div className="pt-4">
      <DocumentList
        entityType="sales_process"
        entityId={process.id}
        title={t("salesProcessDocuments")}
      />
    </div>
  );
};

export default DocumentsTab;
