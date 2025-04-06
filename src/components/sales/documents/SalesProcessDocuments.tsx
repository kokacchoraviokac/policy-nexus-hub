
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesProcess } from "@/types/salesProcess";
import { useDocuments } from "@/hooks/useDocuments";
import DocumentList from "@/components/documents/DocumentList";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";

export interface SalesProcessDocumentsProps {
  process: SalesProcess;
  salesStage?: string;
}

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({ process, salesStage = 'default' }) => {
  const { t } = useLanguage();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { 
    documents, 
    isLoading, 
    error, 
    refetch,
    deleteDocument,
    isDeletingDocument,
    isError
  } = useDocuments("sales_process", process.id);
  
  const handleOpenUploadDialog = () => {
    setShowUploadDialog(true);
  };
  
  const handleCloseUploadDialog = () => {
    setShowUploadDialog(false);
  };
  
  const handleUploadComplete = () => {
    setShowUploadDialog(false);
    setUploading(false);
    refetch();
  };
  
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{t("processDocuments")}</CardTitle>
        <Button 
          size="sm" 
          onClick={handleOpenUploadDialog}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("uploading")}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {t("uploadDocument")}
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <DocumentList 
          entityType="sales_process"
          entityId={process.id}
          documents={documents}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onUploadClick={handleOpenUploadDialog}
          onDelete={deleteDocument}
          isDeleting={isDeletingDocument}
        />
        
        {showUploadDialog && (
          <DocumentUploadDialog
            open={showUploadDialog}
            onOpenChange={handleCloseUploadDialog}
            entityType="sales_process"
            entityId={process.id}
            onUploadComplete={handleUploadComplete}
            salesStage={salesStage}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SalesProcessDocuments;
