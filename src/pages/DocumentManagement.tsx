
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DocumentSearch } from '@/components/documents/search/DocumentSearch';
import DocumentUploadDialog from '@/components/documents/unified/DocumentUploadDialog';
import { Document, EntityType } from '@/types/documents';
import { useDocumentSearch } from '@/hooks/useDocumentSearch';

const DocumentManagement: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType>('policy');
  
  const showUploadDialog = (entityType: EntityType) => {
    setSelectedEntityType(entityType);
    setUploadDialogOpen(true);
  };
  
  const handleUploadComplete = () => {
    // You might want to refresh data or show a success message
  };
  
  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader
        title={t('documentManagement')}
        description={t('manageAllDocumentsAcrossYourOrganization')}
        actions={
          <Button onClick={() => showUploadDialog('policy')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('uploadDocument')}
          </Button>
        }
      />
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all">{t('allDocuments')}</TabsTrigger>
          <TabsTrigger value="policy">{t('policyDocuments')}</TabsTrigger>
          <TabsTrigger value="claim">{t('claimDocuments')}</TabsTrigger>
          <TabsTrigger value="client">{t('clientDocuments')}</TabsTrigger>
          <TabsTrigger value="pending">{t('pendingApproval')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <DocumentSearch />
        </TabsContent>
        
        <TabsContent value="policy">
          <DocumentSearch 
            title={t('policyDocuments')}
            filterEntity="policy"
          />
        </TabsContent>
        
        <TabsContent value="claim">
          <DocumentSearch 
            title={t('claimDocuments')}
            filterEntity="claim"
          />
        </TabsContent>
        
        <TabsContent value="client">
          <DocumentSearch 
            title={t('clientDocuments')}
            filterEntity="client"
          />
        </TabsContent>
        
        <TabsContent value="pending">
          <DocumentSearch 
            title={t('documentsAwaitingApproval')}
            filterStatus="pending"
          />
        </TabsContent>
      </Tabs>
      
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        entityType={selectedEntityType}
        entityId="" // You'll need to select an entity ID to upload to
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default DocumentManagement;
