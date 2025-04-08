
import React, { useEffect, useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { EntityType, DocumentCategory } from '@/types/documents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentList from '@/components/documents/DocumentList';
import DocumentUploadDialog from '@/components/documents/unified/DocumentUploadDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { SalesProcess } from '@/types/salesProcess';

interface SalesProcessDocumentsProps {
  salesProcess: SalesProcess;
  salesStage?: string;
}

const documentCategories = [
  { value: 'discovery', label: 'discovery' },
  { value: 'quote', label: 'quoteManagement' },
  { value: 'proposal', label: 'proposals' },
  { value: 'contract', label: 'contracts' },
  { value: 'closeout', label: 'closeout' },
];

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({
  salesProcess,
  salesStage = 'discovery',
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(salesStage);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Fetch all documents for this sales process
  const {
    documents,
    isLoading,
    error,
    deleteDocument,
    isDeletingDocument,
    refetchDocuments
  } = useDocuments(EntityType.SALES_PROCESS, salesProcess.id);
  
  // Set the active tab based on the sales stage (if provided)
  useEffect(() => {
    if (salesStage) {
      setActiveTab(salesStage);
    }
  }, [salesStage]);
  
  const handleUploadComplete = () => {
    refetchDocuments();
    setUploadDialogOpen(false);
  };
  
  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('salesDocuments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-4 overflow-x-auto">
              {documentCategories.map((category) => (
                <TabsTrigger key={category.value} value={category.value}>
                  {t(category.label)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {documentCategories.map((category) => (
              <TabsContent key={category.value} value={category.value} className="pt-4">
                <DocumentList
                  entityType={EntityType.SALES_PROCESS}
                  entityId={salesProcess.id}
                  documents={documents?.filter(doc => doc.category === category.value)}
                  isLoading={isLoading}
                  isError={!!error}
                  error={error as Error}
                  onDelete={deleteDocument}
                  isDeleting={isDeletingDocument}
                  showUploadButton={false}
                />
                
                <div className="mt-4 flex justify-end">
                  <DocumentUploadDialog
                    open={uploadDialogOpen && activeTab === category.value}
                    onOpenChange={setUploadDialogOpen}
                    entityType={EntityType.SALES_PROCESS}
                    entityId={salesProcess.id}
                    onUploadComplete={handleUploadComplete}
                    defaultCategory={category.value as DocumentCategory}
                    salesStage={category.value}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesProcessDocuments;
