
import React, { useState, useMemo, ChangeEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Eye, Download, Calendar, FileText, File } from "lucide-react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Document } from "@/types/documents";
import { useDocumentSearch } from "@/hooks/useDocumentSearch";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { DocumentViewDialog } from "../DocumentViewDialog";
import Pagination from "@/components/ui/pagination";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import { formatDateToLocal } from "@/utils/dateUtils";

interface DocumentSearchProps {
  title?: string;
  showTableHeader?: boolean;
  filterEntity?: string;
  filterEntityId?: string;
  onDocumentSelected?: (document: Document) => void;
  selectable?: boolean;
}

const ITEMS_PER_PAGE = 10;

export const DocumentSearch = ({
  title = "Document Search",
  showTableHeader = true,
  filterEntity,
  filterEntityId,
  onDocumentSelected,
  selectable = false
}: DocumentSearchProps) => {
  const { t, formatDateTime } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const { downloadDocument, isDownloading } = useDocumentDownload();
  
  const { 
    documents, 
    isLoading, 
    totalPages, 
    totalDocuments 
  } = useDocumentSearch({
    searchTerm,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    documentType: selectedDocumentType,
    category: selectedCategory,
    entityType: filterEntity,
    entityId: filterEntityId
  });
  
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
  };
  
  const handleSelectDocument = (document: Document) => {
    if (onDocumentSelected) {
      onDocumentSelected(document);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const columns = useMemo(() => [
    {
      id: "select",
      cell: ({ row }: { row: any }) => {
        if (!selectable) return null;
        return (
          <div className="flex items-center">
            <Checkbox 
              checked={false} 
              onCheckedChange={() => handleSelectDocument(row.original)}
            />
          </div>
        );
      }
    },
    {
      accessorKey: "document_name",
      header: t("documentName"),
      cell: ({ row }: { row: any }) => {
        const document: Document = row.original;
        return (
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{document.document_name}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "document_type",
      header: t("type"),
      cell: ({ row }: { row: any }) => {
        const document: Document = row.original;
        return <span>{t(document.document_type)}</span>;
      }
    },
    {
      accessorKey: "category",
      header: t("category"),
      cell: ({ row }: { row: any }) => {
        const document: Document = row.original;
        return document.category ? (
          <Badge variant="outline">{t(document.category)}</Badge>
        ) : null;
      }
    },
    {
      accessorKey: "created_at",
      header: t("uploadedOn"),
      cell: ({ row }: { row: any }) => {
        const document: Document = row.original;
        return (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDateToLocal(document.created_at)}</span>
          </div>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const document: Document = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => handleViewDocument(document)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => downloadDocument(document)}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ], [selectable, t, isDownloading, downloadDocument]);

  return (
    <Card>
      {showTableHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {t("searchDocumentsDescription")}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <InputWithIcon
                placeholder={t("searchDocuments")}
                value={searchTerm}
                onChange={handleSearch}
                className="w-full"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder={t("type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allTypes")}</SelectItem>
                <SelectItem value="policy">{t("policy")}</SelectItem>
                <SelectItem value="invoice">{t("invoice")}</SelectItem>
                <SelectItem value="contract">{t("contract")}</SelectItem>
                <SelectItem value="report">{t("report")}</SelectItem>
                <SelectItem value="other">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder={t("category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allCategories")}</SelectItem>
                <SelectItem value="policy">{t("policy")}</SelectItem>
                <SelectItem value="client">{t("client")}</SelectItem>
                <SelectItem value="invoice">{t("invoice")}</SelectItem>
                <SelectItem value="contract">{t("contract")}</SelectItem>
                <SelectItem value="report">{t("report")}</SelectItem>
                <SelectItem value="other">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <LoadingState>{t("loadingDocuments")}</LoadingState>
          ) : documents.length === 0 ? (
            <EmptyState 
              icon={<File className="h-12 w-12 text-muted-foreground" />}
              title={t("noDocumentsFound")}
              description={t("tryDifferentSearchOrFilters")}
            />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {selectable && <TableHead style={{ width: 40 }}></TableHead>}
                      <TableHead>{t("documentName")}</TableHead>
                      <TableHead>{t("type")}</TableHead>
                      <TableHead>{t("category")}</TableHead>
                      <TableHead>{t("uploadedOn")}</TableHead>
                      <TableHead style={{ width: 100 }}>{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((document) => (
                      <TableRow key={document.id}>
                        {selectable && (
                          <TableCell>
                            <Checkbox 
                              checked={false} 
                              onCheckedChange={() => handleSelectDocument(document)}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{document.document_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{t(document.document_type || "other")}</TableCell>
                        <TableCell>
                          {document.category && (
                            <Badge variant="outline">{t(document.category)}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{formatDateToLocal(document.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleViewDocument(document)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => downloadDocument(document)}
                              disabled={isDownloading}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 py-2">
                  <Pagination
                    itemsCount={totalDocuments}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      
      {selectedDocument && (
        <DocumentViewDialog
          document={selectedDocument}
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
        />
      )}
    </Card>
  );
};
