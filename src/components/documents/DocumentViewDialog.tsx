
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate, formatDateTime, formatDateToLocal } from '@/utils/dateUtils';
import { Badge } from '@/components/ui/badge';
import { Download, File, FileCheck, FileWarning } from 'lucide-react';
import { Document } from '@/types/documents';
import { useLanguage } from '@/contexts/LanguageContext';

interface DocumentViewDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onNewVersion?: () => void;
  disableVersioning?: boolean;
  disableDelete?: boolean;
}

export function DocumentViewDialog({
  document,
  open,
  onOpenChange,
  onDownload,
  onDelete,
  onNewVersion,
  disableVersioning = false,
  disableDelete = false
}: DocumentViewDialogProps) {
  const { t } = useLanguage();
  
  const getStatusBadge = () => {
    if (!document.approval_status) return null;
    
    switch (document.approval_status) {
      case 'approved':
        return (
          <Badge variant="success" className="ml-2 gap-1">
            <FileCheck className="h-3.5 w-3.5" />
            {t('approved')}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="ml-2 gap-1">
            <FileWarning className="h-3.5 w-3.5" />
            {t('rejected')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="ml-2 gap-1">
            <File className="h-3.5 w-3.5" />
            {t('pending')}
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {document.document_name}
            {getStatusBadge()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t('documentType')}</div>
              <div>{t(document.document_type)}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t('category')}</div>
              <div>{t(document.category)}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t('uploadedBy')}</div>
              <div>{document.uploaded_by_name || document.uploaded_by}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t('uploadedAt')}</div>
              <div>{formatDateToLocal(document.created_at)}</div>
            </div>
            
            {document.version > 1 && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t('version')}</div>
                <div>{document.version}</div>
              </div>
            )}
          </div>
          
          {document.comments && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t('comments')}</div>
              <div className="bg-muted p-3 rounded-md text-sm">{document.comments}</div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            {!disableDelete && onDelete && (
              <Button variant="destructive" onClick={onDelete}>
                {t('delete')}
              </Button>
            )}
          </div>
          
          <div className="flex gap-2 justify-end">
            {!disableVersioning && onNewVersion && (
              <Button variant="outline" onClick={onNewVersion}>
                {t('uploadNewVersion')}
              </Button>
            )}
            
            {onDownload && (
              <Button onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                {t('download')}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
