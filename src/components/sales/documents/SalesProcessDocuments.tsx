
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSalesProcessDocuments } from "@/hooks/sales/useSalesProcessDocuments";
import DocumentList from "@/components/documents/DocumentList";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, Filter } from "lucide-react";
import { SalesProcess } from "@/types/sales";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EntityType } from "@/types/documents";

interface SalesProcessDocumentsProps {
  salesProcess: SalesProcess;
}

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({ 
  salesProcess 
}) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // We use a custom hook to fetch and manage documents
  const { 
    documents, 
    isLoading, 
    error, 
    documentsCount,
    // Add missing properties with default implementations
    isError: isLoadingError = false,
    refetch: refreshDocuments = () => Promise.resolve(),
    deleteDocument = () => Promise.resolve(),
    updateDocumentApproval = () => Promise.resolve()
  } = useSalesProcessDocuments(salesProcess.id);
  
  // Derived values
  const hasDocuments = documents && documents.length > 0;
  const currentStage = salesProcess.stage || "unknown";
  
  // Calculate document categories from the sales process stage
  const getStageDocumentCategory = (stage: string): string => {
    const categoryMap: Record<string, string> = {
      "initial": "discovery",
      "quote_requested": "quote",
      "quotes_received": "quote",
      "proposal_preparation": "proposal",
      "proposal_sent": "proposal",
      "contract_preparation": "contract",
      "contract_sent": "contract",
      "contract_received": "contract",
      "completed": "closeout",
      "canceled": "other",
    };
    
    return categoryMap[stage] || "other";
  };
  
  const handleUploadComplete = () => {
    refreshDocuments();
  };
  
  const filteredDocuments = categoryFilter === "all" 
    ? documents 
    : documents.filter(doc => doc.category === categoryFilter);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">{t("documents")}</CardTitle>
        <div className="flex items-center space-x-2">
          <Select 
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("filter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allDocuments")}</SelectItem>
              <SelectItem value="discovery">{t("discovery")}</SelectItem>
              <SelectItem value="quote">{t("quotes")}</SelectItem>
              <SelectItem value="proposal">{t("proposals")}</SelectItem>
              <SelectItem value="contract">{t("contracts")}</SelectItem>
              <SelectItem value="closeout">{t("closeout")}</SelectItem>
              <SelectItem value="other">{t("other")}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            size="sm" 
            onClick={() => setUploadDialogOpen(true)}
          >
            <FilePlus className="h-4 w-4 mr-2" />
            {t("uploadDocument")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isLoadingError ? (
          <Alert variant="destructive">
            <AlertDescription>
              {t("errorLoadingDocuments")}
            </AlertDescription>
          </Alert>
        ) : (
          <DocumentList
            entityType="sales_process"
            entityId={salesProcess.id}
            documents={filteredDocuments}
            showUploadButton={false}
            onUploadClick={() => setUploadDialogOpen(true)}
            onDelete={deleteDocument}
            isDeleting={false}
          />
        )}
      </CardContent>
      
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        entityType="sales_process"
        entityId={salesProcess.id}
        onUploadComplete={handleUploadComplete}
        defaultCategory={getStageDocumentCategory(currentStage)}
        salesStage={currentStage}
      />
    </Card>
  );
};

export default SalesProcessDocuments;
