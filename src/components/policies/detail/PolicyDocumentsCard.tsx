
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";

interface PolicyDocumentsCardProps {
  policyId: string;
  documentsCount: number;
}

const PolicyDocumentsCard: React.FC<PolicyDocumentsCardProps> = ({
  policyId,
  documentsCount,
}) => {
  const { t } = useLanguage();
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleViewDocuments = () => {
    // Navigate to documents tab
    const documentsTab = document.querySelector('[data-value="documents"]');
    if (documentsTab instanceof HTMLElement) {
      documentsTab.click();
    }
  };

  const handleUploadDocuments = () => {
    setShowUploadDialog(true);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start mb-4">
          <FileText className="h-5 w-5 text-muted-foreground mr-2" />
          <h3 className="font-semibold">{t("policyDocuments")}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("totalDocuments")}</span>
            <Badge variant={documentsCount > 0 ? "secondary" : "outline"}>
              {documentsCount}
            </Badge>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleViewDocuments}
              disabled={documentsCount === 0}
            >
              {t("viewDocuments")}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full flex items-center gap-2"
              onClick={handleUploadDocuments}
            >
              <Upload className="h-4 w-4" />
              {t("uploadDocuments")}
            </Button>
          </div>
        </div>
      </CardContent>

      {showUploadDialog && (
        <DocumentUploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          entityType="policy"
          entityId={policyId}
        />
      )}
    </Card>
  );
};

export default PolicyDocumentsCard;
