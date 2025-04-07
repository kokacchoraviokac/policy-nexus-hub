
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download, Clock, CheckCircle, XCircle, Upload, FileUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EntityType, Document } from "@/types/documents";
import DocumentViewDialog from "./DocumentViewDialog";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ApprovalStatus } from "@/types/common";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentListProps {
  documents: Document[];
  entityType: EntityType;
  entityId: string;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | any;
  onDelete?: (documentId: string | Document) => Promise<void> | void;
  isDeleting?: boolean;
  showUploadButton?: boolean;
  onUpload?: () => void;
  onUploadVersion?: (document: Document) => void;
  showApprovalStatus?: boolean;
  onApprove?: (documentId: string) => void;
  onReject?: (documentId: string) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
  emptyStateMessage?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  entityType,
  entityId,
  isLoading = false,
  isError = false,
  error,
  onDelete,
  isDeleting = false,
  showUploadButton = true,
  onUpload,
  onUploadVersion,
  showApprovalStatus = false,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
  emptyStateMessage,
}) => {
  const { t } = useLanguage();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-destructive/10 rounded-md p-4 mt-4">
        <p className="text-destructive font-medium">{t("errorLoadingDocuments")}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {error?.message || t("genericErrorMessage")}
        </p>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mb-2 opacity-20" />
        <p className="text-center mb-4">{emptyStateMessage || t("noDocumentsFound")}</p>
        {showUploadButton && onUpload && (
          <Button onClick={onUpload} variant="outline" size="sm">
            <FileUp className="mr-2 h-4 w-4" />
            {t("uploadDocument")}
          </Button>
        )}
      </div>
    );
  }

  const getApprovalStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case ApprovalStatus.APPROVED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {t("approved")}
          </Badge>
        );
      case ApprovalStatus.REJECTED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            {t("rejected")}
          </Badge>
        );
      case ApprovalStatus.PENDING:
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t("pending")}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((document) => (
          <Card key={document.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div 
                  className="p-4 cursor-pointer hover:bg-muted/50 flex items-start gap-3"
                  onClick={() => setSelectedDocument(document)}
                >
                  <div className="bg-muted rounded-md p-2 flex-shrink-0">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm truncate" title={document.document_name}>
                        {document.document_name}
                      </h4>
                      {showApprovalStatus && getApprovalStatusBadge(document.status as string)}
                    </div>
                    
                    <div className="flex flex-wrap text-xs text-muted-foreground mt-1 gap-x-4">
                      <span>{document.document_type}</span>
                      {document.category && <span>{t(document.category)}</span>}
                      <span title={new Date(document.created_at).toLocaleString()}>
                        {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
                      </span>
                      {document.version && (
                        <span>{t("version")} {document.version}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border-t px-4 py-2 flex justify-end space-x-2">
                  {onUploadVersion && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUploadVersion(document);
                      }}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1" />
                      {t("newVersion")}
                    </Button>
                  )}
                  
                  {onApprove && showApprovalStatus && document.status !== ApprovalStatus.APPROVED && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-green-700 hover:text-green-800 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove(document.id);
                      }}
                      disabled={isApproving}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      {t("approve")}
                    </Button>
                  )}
                  
                  {onReject && showApprovalStatus && document.status !== ApprovalStatus.REJECTED && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject(document.id);
                      }}
                      disabled={isRejecting}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      {t("reject")}
                    </Button>
                  )}
                  
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(document.id);
                      }}
                      disabled={isDeleting}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      {t("delete")}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {showUploadButton && onUpload && (
        <div className="flex justify-center mt-4">
          <Button onClick={onUpload} variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            {t("uploadDocument")}
          </Button>
        </div>
      )}
      
      {selectedDocument && (
        <DocumentViewDialog
          document={selectedDocument}
          open={!!selectedDocument}
          onOpenChange={(open) => {
            if (!open) setSelectedDocument(null);
          }}
          onUploadVersion={onUploadVersion ? () => onUploadVersion(selectedDocument) : undefined}
          onDelete={onDelete ? () => onDelete(selectedDocument) : undefined}
          showApprovalStatus={showApprovalStatus}
          onApprove={onApprove ? () => onApprove(selectedDocument.id) : undefined}
          onReject={onReject ? () => onReject(selectedDocument.id) : undefined}
        />
      )}
    </div>
  );
};

export default DocumentList;
