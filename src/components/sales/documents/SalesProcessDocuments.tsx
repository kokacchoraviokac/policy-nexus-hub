
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSalesProcessDocuments } from '@/hooks/sales/useSalesProcessDocuments';
import DocumentList from '@/components/documents/unified/DocumentList';
import DocumentUploadDialog from '@/components/documents/unified/DocumentUploadDialog';
import { Plus } from 'lucide-react';
import { Document } from '@/types/documents';

interface SalesProcessDocumentsProps {
  salesProcessId: string;
  salesStage?: string;
}

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({ 
  salesProcessId,
  salesStage
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const { 
    documents, 
    isLoading, 
    isError, 
    error,
    refetch,
    deleteDocument,
    updateDocumentApproval
  } = useSalesProcessDocuments(salesProcessId);
  
  // Mocked properties for now
  const isDeletingDocument = false;
  const isApprovingDocument = false;
  
  const handleDelete = async (document: Document) => {
    if (typeof document === 'string') {
      await deleteDocument(document);
    } else {
      await deleteDocument(document.id);
    }
    refetch();
  };
  
  const handleApprove = async (document: Document, status: string, notes?: string) => {
    await updateDocumentApproval(document.id, status, notes);
    refetch();
  };
  
  const getFilteredDocuments = (category: string) => {
    if (category === 'all') return documents;
    return documents.filter(doc => doc.category === category);
  };

  const openUploadDialog = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadComplete = () => {
    refetch();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl">{t("documents")}</CardTitle>
        <Button onClick={openUploadDialog} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("uploadDocument")}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">{t("allDocuments")}</TabsTrigger>
            <TabsTrigger value="contract">{t("contracts")}</TabsTrigger>
            <TabsTrigger value="quote">{t("quotes")}</TabsTrigger>
            <TabsTrigger value="proposal">{t("proposals")}</TabsTrigger>
            <TabsTrigger value="other">{t("other")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <DocumentList
              documents={documents}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onDelete={handleDelete}
              isDeleting={isDeletingDocument}
              showUploadButton={false}
            />
          </TabsContent>
          
          {['contract', 'quote', 'proposal', 'other'].map(category => (
            <TabsContent key={category} value={category}>
              <DocumentList
                documents={getFilteredDocuments(category)}
                isLoading={isLoading}
                isError={isError}
                error={error}
                onDelete={handleDelete}
                isDeleting={isDeletingDocument}
                showUploadButton={false}
                filterCategory={category}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <DocumentUploadDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen}
        entityType="sales_process"
        entityId={salesProcessId}
        onUploadComplete={handleUploadComplete}
        defaultCategory={selectedCategory !== 'all' ? selectedCategory : undefined}
        salesStage={salesStage}
      />
    </Card>
  );
};

export default SalesProcessDocuments;
