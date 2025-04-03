
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, Filter, Download, MoreHorizontal, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocumentSearch } from "@/hooks/useDocumentSearch";
import { documentCategories, supportedDocumentTypes } from "@/utils/documentUtils";
import { Document, EntityType } from "@/types/documents";
import { DataTable } from "@/components/ui/common";
import DocumentPreview from "../unified/DocumentPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";

interface DocumentSearchProps {
  entityType?: EntityType;
  entityId?: string;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({
  entityType,
  entityId
}) => {
  const { t, formatDate } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { downloadDocument, isDownloading } = useDocumentDownload();
  
  const { 
    documents, 
    isLoading, 
    error, 
    searchDocuments 
  } = useDocumentSearch({
    entityType,
    entityId
  });
  
  // When search parameters change, execute the search
  useEffect(() => {
    const params = {
      searchTerm,
      category: selectedCategory,
      documentType: selectedDocumentType,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined
    };
    
    searchDocuments(params);
  }, [searchTerm, selectedCategory, selectedDocumentType, dateFrom, dateTo]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchDocuments({
      searchTerm,
      category: selectedCategory,
      documentType: selectedDocumentType,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined
    });
  };
  
  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDocumentType("");
    setDateFrom("");
    setDateTo("");
    searchDocuments({});
  };
  
  const handlePreview = (document: Document) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };
  
  const handleDownload = (document: Document) => {
    downloadDocument(document);
  };
  
  const columns = [
    {
      accessorKey: "document_name",
      header: t("name"),
      cell: ({ row }) => {
        const document = row.original as Document;
        return (
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span 
              className="cursor-pointer hover:underline"
              onClick={() => handlePreview(document)}
            >
              {document.document_name}
            </span>
            {document.version > 1 && (
              <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                v{document.version}
              </span>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "document_type",
      header: t("type"),
      cell: ({ row }) => {
        const document = row.original as Document;
        const typeLabel = supportedDocumentTypes.find(t => t.value === document.document_type)?.label || document.document_type;
        return <span>{typeLabel}</span>;
      }
    },
    {
      accessorKey: "category",
      header: t("category"),
      cell: ({ row }) => {
        const document = row.original as Document;
        const categoryLabel = documentCategories.find(c => c.value === document.category)?.label || document.category;
        return <span>{categoryLabel}</span>;
      }
    },
    {
      accessorKey: "created_at",
      header: t("uploadedOn"),
      cell: ({ row }) => {
        const document = row.original as Document;
        return <span>{formatDate(document.created_at)}</span>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const document = row.original as Document;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlePreview(document)}>
                <FileText className="mr-2 h-4 w-4" />
                {t("preview")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload(document)}>
                <Download className="mr-2 h-4 w-4" />
                {t("download")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center p-8">
          <p className="text-destructive">{error.message || t("errorLoadingDocuments")}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => searchDocuments({})}
          >
            {t("retry")}
          </Button>
        </div>
      );
    }
    
    if (!documents || documents.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground">{t("noDocumentsFound")}</p>
        </div>
      );
    }
    
    return (
      <DataTable
        columns={columns}
        data={documents}
        pageSize={10}
      />
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{t("documentSearch")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t("searchDocumentsByName")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex flex-row gap-2">
              <Button variant="outline" type="submit">
                <Search className="h-4 w-4 mr-2" />
                {t("search")}
              </Button>
              <Button variant="outline" type="button" onClick={handleReset}>
                {t("reset")}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t("allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("allCategories")}</SelectItem>
                  {documentCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder={t("allDocumentTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("allDocumentTypes")}</SelectItem>
                  {supportedDocumentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="date"
                placeholder={t("dateFrom")}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="date"
                placeholder={t("dateTo")}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </form>
        
        <div className="mt-6">
          {renderContent()}
        </div>
        
        <DocumentPreview
          document={selectedDocument}
          open={showPreview}
          onOpenChange={setShowPreview}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentSearch;
