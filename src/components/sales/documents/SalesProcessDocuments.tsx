
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import DocumentList from "@/components/documents/unified/DocumentList";
import DocumentUploadDialog from "@/components/documents/unified/DocumentUploadDialog";
import { Document } from "@/types/documents";

interface SalesProcessDocumentsProps {
  salesProcessId: string;
  currentStage: string;
}

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({
  salesProcessId,
  currentStage
}) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>(currentStage);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>(undefined);
  
  const {
    documents,
    isLoading,
    isError,
    error,
    deleteDocument,
    isDeleting
  } = useDocumentManager({
    entityType: "sales_process",
    entityId: salesProcessId
  });
  
  const stageCategories = [
    { id: "discovery", label: t("discovery") },
    { id: "quote", label: t("quoteManagement") },
    { id: "proposal", label: t("proposals") },
    { id: "contract", label: t("contracts") },
    { id: "closeout", label: t("closeout") }
  ];
  
  const handleOpenUploadDialog = () => {
    setSelectedDocument(undefined);
    setUploadDialogOpen(true);
  };
  
  const handleUploadVersion = (document: Document) => {
    setSelectedDocument(document);
    setUploadDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {t("documents")} 
          {documents.length > 0 && (
            <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
              {documents.length}
            </span>
          )}
        </h3>
        <Button size="sm" onClick={handleOpenUploadDialog}>
          <FileUp className="mr-2 h-4 w-4" />
          {t("uploadDocument")}
        </Button>
      </div>
      
      <Tabs defaultValue={selectedStage} value={selectedStage} onValueChange={setSelectedStage}>
        <TabsList className="grid grid-cols-5">
          {stageCategories.map(stage => (
            <TabsTrigger 
              key={stage.id} 
              value={stage.id}
              className="text-xs sm:text-sm"
            >
              {stage.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {stageCategories.map(stage => (
          <TabsContent key={stage.id} value={stage.id} className="mt-4">
            <DocumentList
              documents={documents}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onDelete={deleteDocument}
              isDeleting={isDeleting}
              onUploadClick={handleOpenUploadDialog}
              showUploadButton={true}
              filterCategory={stage.id}
              onUploadVersion={handleUploadVersion}
            />
          </TabsContent>
        ))}
      </Tabs>
      
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        entityType="sales_process"
        entityId={salesProcessId}
        selectedDocument={selectedDocument}
        defaultCategory={selectedStage}
        salesStage={selectedStage}
      />
    </div>
  );
};

export default SalesProcessDocuments;
