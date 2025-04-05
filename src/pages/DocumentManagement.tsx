
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DocumentSearch } from '@/components/documents/search/DocumentSearch';
import { DocumentUploadDialog } from '@/components/documents/unified/DocumentUploadDialog';

export default function DocumentManagement() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title={t('documentManagement')}
        description={t('documentManagementDescription')}
        actions={
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('uploadDocument')}
          </Button>
        }
      />
      
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">{t('allDocuments')}</TabsTrigger>
              <TabsTrigger value="pending">{t('pendingApproval')}</TabsTrigger>
              <TabsTrigger value="approved">{t('approved')}</TabsTrigger>
              <TabsTrigger value="rejected">{t('rejected')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <DocumentSearch 
                title={t('allDocuments')} 
                showTableHeader={false}
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <DocumentSearch 
                title={t('pendingApproval')} 
                showTableHeader={false}
              />
            </TabsContent>
            
            <TabsContent value="approved">
              <DocumentSearch 
                title={t('approved')} 
                showTableHeader={false}
              />
            </TabsContent>
            
            <TabsContent value="rejected">
              <DocumentSearch 
                title={t('rejected')} 
                showTableHeader={false}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        entityType="client"
        entityId="temp-client-id"
      />
    </div>
  );
}
