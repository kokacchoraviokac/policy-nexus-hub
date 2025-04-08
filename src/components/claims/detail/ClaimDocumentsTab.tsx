
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DocumentList from "@/components/documents/DocumentList";

interface ClaimDocumentsTabProps {
  claimId: string;
}

const ClaimDocumentsTab: React.FC<ClaimDocumentsTabProps> = ({ claimId }) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <DocumentList 
        entityType="claim" 
        entityId={claimId}
        showUploadButton={false}
      />
    </div>
  );
};

export default ClaimDocumentsTab;
