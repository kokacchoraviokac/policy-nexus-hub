
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DocumentList from "@/components/documents/DocumentList";
import { EntityType } from "@/types/common";

interface ClaimDocumentsTabProps {
  claimId: string;
}

const ClaimDocumentsTab: React.FC<ClaimDocumentsTabProps> = ({ claimId }) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <DocumentList 
        entityType={EntityType.CLAIM} 
        entityId={claimId}
        showUploadButton={false}
      />
    </div>
  );
};

export default ClaimDocumentsTab;
