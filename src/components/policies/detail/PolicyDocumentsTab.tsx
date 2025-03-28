
import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DocumentList from "@/components/documents/DocumentList";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";

interface PolicyDocumentsTabProps {
  policyId: string;
}

const PolicyDocumentsTab: React.FC<PolicyDocumentsTabProps> = ({ policyId }) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const handleUploadDocument = () => {
    setUploadDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">{t("policyDocuments")}</h3>
            <Button onClick={handleUploadDocument}>
              <FileUp className="mr-2 h-4 w-4" />
              {t("uploadDocument")}
            </Button>
          </div>
          
          <DocumentList 
            entityType="policy"
            entityId={policyId}
            onUploadClick={handleUploadDocument}
          />
        </CardContent>
      </Card>
      
      <DocumentUploadDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen} 
        entityType="policy"
        entityId={policyId}
      />
    </>
  );
};

export default PolicyDocumentsTab;
