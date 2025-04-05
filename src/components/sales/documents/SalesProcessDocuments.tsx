
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Document, EntityType } from "@/types/documents";
import { useSalesProcessDocuments } from "@/hooks/sales/useSalesProcessDocuments";
import DocumentList from "@/components/documents/DocumentList";
import DocumentUploadDialog from "@/components/documents/unified/DocumentUploadDialog";

interface SalesProcessDocumentsProps {
  salesProcessId: string;
  currentStage?: string;
}

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({ 
  salesProcessId,
  currentStage 
}) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const {
    documents,
    isLoading,
    error,
    documentsCount
  } = useSalesProcessDocuments(salesProcessId);
  
  // Define a function to handle document deletion
  const handleDeleteDocument = async (documentId: string | Document) => {
    // Implementation would go here
    console.log("Delete document:", documentId);
  };
  
  // Add a mocked approval handler until we implement the real one
  const handleApproveDocument = (document: any, status: any, notes: any) => {
    console.log("Approve document:", document.id, status, notes);
    return Promise.resolve();
  };
  
  // Handle document upload completion
  const handleUploadComplete = () => {
    // Refresh documents list
    console.log("Document upload complete");
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-medium">{t("documents")}</CardTitle>
          <Button 
            size="sm" 
            onClick={() => setUploadDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            {t("upload")}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Use DocumentList component to display documents */}
        <DocumentList
          documents={documents}
          isLoading={isLoading}
          isError={!!error}
          error={error}
          onDelete={handleDeleteDocument}
          isDeleting={false}
          showUploadButton={false}
          entityType="sales_process"
          entityId={salesProcessId}
        />
        
        {/* Upload dialog */}
        <DocumentUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          entityType="sales_process"
          entityId={salesProcessId}
          onUploadComplete={handleUploadComplete}
          salesStage={currentStage}
        />
      </CardContent>
    </Card>
  );
};

export default SalesProcessDocuments;
