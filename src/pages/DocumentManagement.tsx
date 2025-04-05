
import React from 'react';
import { H1 } from '@/components/ui/typography';
import { Separator } from '@/components/ui/separator';
import PageContainer from '@/components/layout/PageContainer';
import DocumentSearch from '@/components/documents/search/DocumentSearch';

const DocumentManagement: React.FC = () => {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <H1>Document Management</H1>
          <p className="text-muted-foreground mt-2">
            Search, view, and manage documents across all modules
          </p>
        </div>
        <Separator />
        
        <DocumentSearch />
      </div>
    </PageContainer>
  );
};

export default DocumentManagement;
