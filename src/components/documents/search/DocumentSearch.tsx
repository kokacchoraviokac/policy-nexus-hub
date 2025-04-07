
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, FileText } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { formatDateToLocal } from '@/utils/dateUtils';
import { useDocumentSearch } from '@/hooks/useDocumentSearch';
import { PolicyDocument } from '@/types/documents';
import { DocumentCategory } from '@/types/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination } from '@/components/ui/pagination';
import DocumentViewDialog from '../DocumentViewDialog';

const DocumentSearch: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewDocument, setViewDocument] = useState<PolicyDocument | null>(null);
  
  const {
    documents,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    searchDocuments,
    currentPage,
    totalPages,
    itemsCount,
    itemsPerPage,
    handlePageChange,
    isError
  } = useDocumentSearch({
    defaultPageSize: 10
  });
  
  const handleSearch = () => {
    searchDocuments();
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'all') {
      setSelectedCategory(undefined);
    } else {
      setSelectedCategory(value as DocumentCategory);
    }
  };
  
  const handleViewDocument = (document: PolicyDocument) => {
    setViewDocument(document);
  };
  
  const renderDocumentTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
        </div>
      );
    }
    
    if (isError) {
      return (
        <div className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">{t("errorLoadingDocuments")}</h3>
          <p className="text-sm text-muted-foreground">{t("pleaseTryAgainLater")}</p>
        </div>
      );
    }
    
    if (!documents.length) {
      return (
        <div className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">{t("noDocumentsFound")}</h3>
          <p className="text-sm text-muted-foreground">{t("tryAdjustingYourSearchFilters")}</p>
        </div>
      );
    }
    
    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead>{t("entityType")}</TableHead>
              <TableHead>{t("uploadedAt")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.document_name}</TableCell>
                <TableCell>{doc.document_type}</TableCell>
                <TableCell>{doc.category ? t(doc.category) : '-'}</TableCell>
                <TableCell>{t(doc.entity_type)}</TableCell>
                <TableCell>{formatDateToLocal(doc.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewDocument(doc)}
                  >
                    {t("view")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsCount={itemsCount}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchDocuments")}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                value={selectedCategory?.toString() || ''}
                onValueChange={(value) => setSelectedCategory(value as DocumentCategory)}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("allCategories")}</SelectItem>
                  <SelectItem value={DocumentCategory.POLICY}>{t("policy")}</SelectItem>
                  <SelectItem value={DocumentCategory.CLAIM}>{t("claim")}</SelectItem>
                  <SelectItem value={DocumentCategory.INVOICE}>{t("invoice")}</SelectItem>
                  <SelectItem value={DocumentCategory.CONTRACT}>{t("contract")}</SelectItem>
                  <SelectItem value={DocumentCategory.MISCELLANEOUS}>{t("other")}</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                {t("search")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("documents")}</CardTitle>
        </CardHeader>
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <div className="px-6">
            <TabsList className="w-full justify-start mb-4 overflow-x-auto">
              <TabsTrigger value="all">{t("allDocuments")}</TabsTrigger>
              <TabsTrigger value={DocumentCategory.POLICY}>{t("policies")}</TabsTrigger>
              <TabsTrigger value={DocumentCategory.CLAIM}>{t("claims")}</TabsTrigger>
              <TabsTrigger value={DocumentCategory.INVOICE}>{t("invoices")}</TabsTrigger>
              <TabsTrigger value={DocumentCategory.CONTRACT}>{t("contracts")}</TabsTrigger>
              <TabsTrigger value={DocumentCategory.MISCELLANEOUS}>{t("other")}</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent>
            {renderDocumentTable()}
          </CardContent>
        </Tabs>
      </Card>
      
      {viewDocument && (
        <DocumentViewDialog
          open={!!viewDocument}
          onOpenChange={(open) => {
            if (!open) setViewDocument(null);
          }}
          document={viewDocument}
        />
      )}
    </div>
  );
};

export default DocumentSearch;
