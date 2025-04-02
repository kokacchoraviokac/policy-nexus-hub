
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesProcess } from "@/types/salesProcess";
import SalesProcessDocuments from "../../documents/SalesProcessDocuments";

interface DocumentsTabProps {
  process: SalesProcess;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ process }) => {
  const { t } = useLanguage();
  
  return (
    <div className="pt-4">
      <SalesProcessDocuments
        salesProcessId={process.id}
        currentStage={process.stage}
      />
    </div>
  );
};

export default DocumentsTab;
