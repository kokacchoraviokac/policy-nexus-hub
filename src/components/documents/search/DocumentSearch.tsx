import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Calendar, FileText, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import { useDocumentSearch } from "@/hooks/useDocumentSearch";
import { Pagination } from "@/components/ui/pagination";
import { LoadingState } from "@/components/ui/loading-state";

interface DocumentSearchProps {
  entityType?: EntityType;
  entityId?: string;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ entityType, entityId }) => {
  const { t, formatDate } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<DocumentCategory | "">("");
  const [documentType, setDocumentType] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { 
    documents, 
    isLoading, 
    error, 
    searchDocuments 
  } = useDocumentSearch({ entityType, entityId });
  
  useEffect(() => {
    searchDocuments({
      searchTerm,
      category,
      documentType,
      dateFrom,
      dateTo
    });
  }, [searchTerm, category, documentType, dateFrom, dateTo, searchDocuments]);
  
  const handleSearch = () => {
    searchDocuments({
      searchTerm,
      category,
      documentType,
      dateFrom,
      dateTo
    });
  };
  
  const handleClearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setDocumentType("");
    setDateFrom(null);
    setDateTo(null);
    
    searchDocuments({});
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  };
  
  if (isLoading) {
    return <LoadingState text={t("searchingDocuments")} />;
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-2" />
            <h3 className="text-lg font-medium">{t("errorSearchingDocuments")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("pleaseTryAgainLater")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="search"
                placeholder={t("searchDocuments")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <Select onValueChange={(value) => setDocumentType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectDocumentType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("allDocumentTypes")}</SelectItem>
                  <SelectItem value="pdf">{t("pdfDocument")}</SelectItem>
                  <SelectItem value="word">{t("wordDocument")}</SelectItem>
                  {/* Add more document types as needed */}
                </SelectContent>
              </Select>
              
              <Select onValueChange={(value) => setCategory(value as DocumentCategory)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("allCategories")}</SelectItem>
                  <SelectItem value="policy">{t("policy")}</SelectItem>
                  <SelectItem value="claim">{t("claim")}</SelectItem>
                  {/* Add more categories as needed */}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  type="date"
                  placeholder={t("dateFrom")}
                  value={dateFrom ? formatDate(dateFrom) : ""}
                  onChange={(e) => setDateFrom(e.target.value ? new Date(e.target.value) : null)}
                />
                <Calendar className="absolute top-2 right-2 h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="relative">
                <Input
                  type="date"
                  placeholder={t("dateTo")}
                  value={dateTo ? formatDate(dateTo) : ""}
                  onChange={(e) => setDateTo(e.target.value ? new Date(e.target.value) : null)}
                />
                <Calendar className="absolute top-2 right-2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={handleClearFilters}>
                {t("clearFilters")}
              </Button>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                {t("search")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">{t("noDocumentsFound")}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("tryAdjustingSearch")}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-medium">{document.document_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t(document.document_type)} • {formatDate(document.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {documents.length > 0 && (
        <Pagination
          itemsCount={documents.length}
          itemsPerPage={pageSize}
          currentPage={page}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default DocumentSearch;
