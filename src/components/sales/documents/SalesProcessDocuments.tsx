
import React, { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Plus, RefreshCw, Loader2 } from 'lucide-react';
import DocumentList from '@/components/documents/DocumentList';
import DocumentUploadDialog from '@/components/documents/unified/DocumentUploadDialog';
import { DocumentCategory } from '@/types/common';
import { SalesProcess } from '@/types/sales';

export interface SalesProcessDocumentsProps {
  process: SalesProcess;
  salesStage?: string;
}

const SalesProcessDocuments: React.FC<SalesProcessDocumentsProps> = ({
  process,
  salesStage = 'default'
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<DocumentCategory | 'all'>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const { 
    documents, 
    isLoading, 
    error, 
    refetch,
    isRefetching
  } = useDocuments('sales_process', process.id);
  
  const handleRefresh = () => {
    refetch();
  };
  
  const filteredDocuments = documents.filter(doc => {
    // Filter by search term
    if (searchTerm && !doc.document_name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by active tab/category
    if (activeTab !== 'all' && doc.category !== activeTab) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">{t('salesProcessDocuments')}</h3>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('searchDocuments')}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button
            size="icon"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            {isRefetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('uploadDocument')}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DocumentCategory | 'all')}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">{t('all')}</TabsTrigger>
          <TabsTrigger value="discovery">{t('discovery')}</TabsTrigger>
          <TabsTrigger value="quote">{t('quoteManagement')}</TabsTrigger>
          <TabsTrigger value="proposal">{t('proposals')}</TabsTrigger>
          <TabsTrigger value="contract">{t('contracts')}</TabsTrigger>
          <TabsTrigger value="closeout">{t('closeout')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <DocumentList
            entityType="sales_process"
            entityId={process.id}
            documents={filteredDocuments}
            isLoading={isLoading}
            isError={!!error}
            error={error as Error}
            showUploadButton={false}
          />
        </TabsContent>
      </Tabs>
      
      <DocumentUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        entityType="sales_process"
        entityId={process.id}
        salesStage={salesStage}
        onUploadComplete={handleRefresh}
        defaultCategory={activeTab !== 'all' ? activeTab as DocumentCategory : undefined}
      />
    </div>
  );
};

export default SalesProcessDocuments;
