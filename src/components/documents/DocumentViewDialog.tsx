
import React from 'react';
import { Document } from '@/types/documents';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDocumentDownload } from '@/hooks/useDocumentDownload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, FileText, Calendar, User } from 'lucide-react';
import { formatDateToLocal } from '@/utils/dateUtils';

export interface DocumentViewDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  document,
  open,
  onOpenChange
}) => {
  const { t } = useLanguage();
  const { downloadDocument, isDownloading } = useDocumentDownload();
  
  const handleDownload = () => {
    downloadDocument(document);
  };
  
  // Function to determine if we can render a preview
  const canRenderPreview = () => {
    if (!document.file_path) return false;
    
    const fileType = document.mime_type?.toLowerCase();
    return fileType?.includes('image') || fileType?.includes('pdf');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            {document.document_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <div className="space-y-1">
              <div className="text-sm font-medium">{t("type")}: {document.document_type}</div>
              {document.category && (
                <div className="text-sm font-medium">{t("category")}: {document.category}</div>
              )}
              <div className="flex items-center text-sm">
                <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{t("uploadedOn")}: {formatDateToLocal(document.created_at)}</span>
              </div>
              {document.uploaded_by_name && (
                <div className="flex items-center text-sm">
                  <User className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{t("uploadedBy")}: {document.uploaded_by_name}</span>
                </div>
              )}
            </div>
          </div>
          
          {canRenderPreview() ? (
            <div className="border rounded-md overflow-hidden aspect-video bg-muted">
              {document.mime_type?.includes('image') ? (
                <img 
                  src={`${process.env.SUPABASE_URL}/storage/v1/object/public/documents/${document.file_path}`}
                  alt={document.document_name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    {t("pdfPreviewNotAvailable")}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-md p-6 bg-muted flex flex-col items-center justify-center space-y-2">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <p className="text-center text-muted-foreground">
                {t("previewNotAvailable")}
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            {t("close")}
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading}>
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? t("downloading") : t("download")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
