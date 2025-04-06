
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Download, Filter, X, FileText } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { useDocumentSearch } from "@/hooks/useDocumentSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { EntityType, DocumentCategory } from "@/types/documents";

const entityTypeOptions: { value: EntityType; label: string }[] = [
  { value: "policy", label: "Policies" },
  { value: "claim", label: "Claims" },
  { value: "sales_process", label: "Sales Processes" },
  { value: "client", label: "Clients" },
  { value: "insurer", label: "Insurers" },
  { value: "addendum", label: "Addendums" },
];

const DocumentSearch: React.FC = () => {
  const { t, formatDate } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const { isDownloading, downloadDocument } = useDocumentDownload();
  
  const {
    documents,
    isLoading,
    error,
    isError,
    totalCount,
    searchDocuments,
    currentPage,
    pageSize,
    totalPages,
    handlePageChange
  } = useDocumentSearch({
    entityType: selectedEntityType !== "all" ? selectedEntityType : undefined,
    initialSearchTerm: searchTerm
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchDocuments({ searchTerm });
  };
  
  const handleDownload = (document: any) => {
    downloadDocument(document);
  };
  
  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedEntityType("all");
    searchDocuments({});
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder={t("searchDocuments")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{t("filters")}</span>
            </Button>
            
            <Button type="submit" className="gap-1.5">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">{t("search")}</span>
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="p-4 border rounded-md bg-muted/20 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("entityType")}</label>
                <Select 
                  value={selectedEntityType} 
                  onValueChange={(value) => setSelectedEntityType(value as EntityType | "all")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectEntityType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allEntityTypes")}</SelectItem>
                    {entityTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </form>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center">
            <p className="text-destructive">{t("errorLoadingDocuments")}</p>
            <Button onClick={() => searchDocuments({ searchTerm })} variant="outline" className="mt-4">
              {t("tryAgain")}
            </Button>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-6 text-center border rounded-md">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">{t("noDocumentsFound")}</h3>
            <p className="text-muted-foreground mt-1">{t("tryAdjustingSearch")}</p>
          </div>
        ) : (
          <>
            {documents.map((document) => (
              <Card key={document.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{document.document_name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {t(document.entity_type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {document.document_type} • {formatDate(document.created_at)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(document)}
                      disabled={isDownloading}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
        
        {!isLoading && documents.length > 0 && (
          <Pagination
            totalPages={totalPages}
            itemsCount={totalCount}
            itemsPerPage={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentSearch;
