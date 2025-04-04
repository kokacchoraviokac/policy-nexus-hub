
import React, { useState, useEffect, ChangeEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocumentSearch } from "@/hooks/useDocumentSearch";
import { Document } from "@/types/documents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/custom-input"; // Use our custom input with icon support
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, FileText, MoreVertical, Download, Eye, Trash2 } from "lucide-react";
import DocumentPreview from "@/components/documents/unified/DocumentPreview";
import DocumentApprovalDialog from "@/components/documents/approval/DocumentApprovalDialog";

interface DocumentSearchProps {
  filterStatus?: string;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ filterStatus }) => {
  const { t, formatDateTime } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(filterStatus || "all");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  
  const {
    documents,
    isLoading,
    error,
    searchDocuments,
    deleteDocument,
  } = useDocumentSearch();
  
  useEffect(() => {
    searchDocuments({
      query: searchQuery,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
    });
  }, [searchQuery, selectedStatus, searchDocuments]);
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };
  
  const handleApproveDocument = (document: Document) => {
    setSelectedDocument(document);
    setApprovalOpen(true);
  };
  
  const handleDeleteDocument = async (document: Document) => {
    if (window.confirm(t("confirmDeleteDocument"))) {
      await deleteDocument(document.id);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-destructive">{t("errorLoadingDocuments")}</h3>
            <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            <Button onClick={() => searchDocuments()} className="mt-4">
              {t("tryAgain")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <CustomInput
            placeholder={t("searchDocuments")}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allDocuments")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
              <SelectItem value="approved">{t("approved")}</SelectItem>
              <SelectItem value="rejected">{t("rejected")}</SelectItem>
              <SelectItem value="needs_review">{t("needsReview")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">{t("noDocumentsFound")}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery ? t("noDocumentsMatchingSearch") : t("noDocumentsAvailable")}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("documentName")}</TableHead>
                    <TableHead>{t("type")}</TableHead>
                    <TableHead>{t("entity")}</TableHead>
                    <TableHead>{t("uploadedAt")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead style={{ width: '80px' }}></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{document.document_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{document.document_type}</TableCell>
                      <TableCell>{t(document.entity_type)}</TableCell>
                      <TableCell>{formatDateTime(document.created_at)}</TableCell>
                      <TableCell>
                        {document.approval_status ? (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            document.approval_status === 'approved' ? 'bg-green-100 text-green-800' : 
                            document.approval_status === 'rejected' ? 'bg-red-100 text-red-800' :
                            document.approval_status === 'needs_review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {t(document.approval_status)}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            {t("pending")}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t("view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              {t("download")}
                            </DropdownMenuItem>
                            {document.approval_status !== 'approved' && document.approval_status !== 'rejected' && (
                              <DropdownMenuItem onClick={() => handleApproveDocument(document)}>
                                {t("approveOrReject")}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteDocument(document)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      
      <DocumentPreview 
        document={selectedDocument} 
        open={previewOpen} 
        onOpenChange={setPreviewOpen} 
      />
      
      <DocumentApprovalDialog 
        document={selectedDocument}
        open={approvalOpen}
        onOpenChange={setApprovalOpen}
        onApproved={() => {
          searchDocuments();
          setApprovalOpen(false);
        }}
      />
    </div>
  );
};

export default DocumentSearch;
