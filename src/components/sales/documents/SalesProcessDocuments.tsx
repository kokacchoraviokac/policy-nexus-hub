
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, FileText } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import DocumentList from '@/components/documents/unified/DocumentList';
import DocumentUploadDialog from '@/components/documents/unified/DocumentUploadDialog';
import { EntityType } from '@/types/common';
import { SalesProcess } from '@/types/sales';

interface DocumentsTabProps {
  salesProcessId: string;
  currentStep?: string;
}

const SalesProcessDocuments: React.FC<DocumentsTabProps> = ({ 
  salesProcessId, 
  currentStep
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const {
    documents,
    isLoading,
    isError,
    error,
    refetch: refreshDocuments,
    deleteDocument,
    isDeletingDocument,
  } = useDocuments(EntityType.SALES_PROCESS, salesProcessId);
  
  const documentCategories = [
    { value: 'all', label: t('allDocuments') },
    { value: 'quote', label: t('quoteManagement') },
    { value: 'authorization', label: t('clientAuthorization') },
    { value: 'proposal', label: t('proposals') },
    { value: 'contract', label: t('contracts') },
    { value: 'closeout', label: t('closeout') },
    { value: 'other', label: t('other') },
  ];
  
  const filteredDocuments = selectedCategory === 'all'
    ? documents
    : documents.filter(doc => doc.category === selectedCategory);
  
  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };
  
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            <FileText className="inline-block mr-2 h-5 w-5" />
            {t('documents')}
          </CardTitle>
          <Button 
            size="sm" 
            className="ml-auto"
            onClick={handleOpenUploadDialog}
          >
            <Plus className="h-4 w-4 mr-1" /> {t('addDocument')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs 
          defaultValue={selectedCategory} 
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="mb-4 flex flex-wrap h-auto">
            {documentCategories.map(category => (
              <TabsTrigger 
                key={category.value} 
                value={category.value}
                className="rounded-full px-3 py-1 text-xs sm:text-sm"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {documentCategories.map(category => (
            <TabsContent key={category.value} value={category.value}>
              <DocumentList
                entityType={EntityType.SALES_PROCESS}
                entityId={salesProcessId}
                documents={filteredDocuments}
                isLoading={isLoading}
                isError={isError}
                error={error}
                onDelete={deleteDocument}
                isDeleting={isDeletingDocument}
                showUploadButton={false}
                filterCategory={category.value === 'all' ? undefined : category.value}
              />
            </TabsContent>
          ))}
        </Tabs>
        
        <DocumentUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          entityType={EntityType.SALES_PROCESS}
          entityId={salesProcessId}
          onUploadComplete={refreshDocuments}
          salesStage={currentStep}
          defaultCategory={currentStep as any}
        />
      </CardContent>
    </Card>
  );
};

export default SalesProcessDocuments;
