
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import EnhancedDocumentUploadDialog from "@/components/documents/EnhancedDocumentUploadDialog";
import DocumentList from "@/components/documents/DocumentList";

interface PolicyDocumentsTabProps {
  policyId: string;
}

const PolicyDocumentsTab: React.FC<PolicyDocumentsTabProps> = ({ policyId }) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("policyDocuments")}</CardTitle>
            <CardDescription>{t("documentsAttachedToPolicy")}</CardDescription>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            {t("uploadDocument")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DocumentList 
          entityType="policy"
          entityId={policyId}
          showUploadButton={false}
        />
        
        <EnhancedDocumentUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          entityType="policy"
          entityId={policyId}
        />
      </CardContent>
    </Card>
  );
};

export default PolicyDocumentsTab;
