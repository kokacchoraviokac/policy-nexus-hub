
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDateToLocal } from '@/utils/dateUtils';
import { Download, FileText, Info, History } from 'lucide-react';
import { Document } from '@/types/documents';
import { useDocumentDownload } from '@/hooks/useDocumentDownload';
import DocumentPdfViewer from './DocumentPdfViewer';

interface DocumentViewDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  document,
  open,
  onOpenChange
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('preview');
  const { isDownloading, downloadDocument } = useDocumentDownload();
  
  const handleDownload = () => {
    if (document) {
      downloadDocument(document);
    }
  };
  
  if (!document) return null;
  
  const isPdf = document.mime_type === 'application/pdf' || 
                document.file_path.toLowerCase().endsWith('.pdf');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span>{document.document_name}</span>
            {document.version && document.version > 1 && (
              <span className="ml-2 text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                v{document.version}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <TabsList>
              <TabsTrigger value="preview">
                <FileText className="h-4 w-4 mr-2" />
                {t("preview")}
              </TabsTrigger>
              <TabsTrigger value="details">
                <Info className="h-4 w-4 mr-2" />
                {t("details")}
              </TabsTrigger>
              {document.version && document.version > 1 && (
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" />
                  {t("versionHistory")}
                </TabsTrigger>
              )}
            </TabsList>
            
            <Button 
              size="sm" 
              onClick={handleDownload} 
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-2" />
              {t("download")}
            </Button>
          </div>
          
          <TabsContent value="preview" className="flex-1 data-[state=active]:flex flex-col overflow-hidden">
            {isPdf ? (
              <DocumentPdfViewer
                documentUrl={document.file_path}
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted/20 rounded-md">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">{t("previewNotAvailable")}</p>
                  <Button 
                    size="sm" 
                    onClick={handleDownload} 
                    variant="outline"
                    className="mt-2"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t("downloadToView")}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="data-[state=active]:flex flex-col space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">{t("basicInformation")}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">{t("name")}</div>
                    <div className="text-sm">{document.document_name}</div>
                    <div className="text-sm text-muted-foreground">{t("type")}</div>
                    <div className="text-sm">{document.document_type}</div>
                    <div className="text-sm text-muted-foreground">{t("uploadedOn")}</div>
                    <div className="text-sm">{formatDateToLocal(document.created_at)}</div>
                    <div className="text-sm text-muted-foreground">{t("version")}</div>
                    <div className="text-sm">
                      {document.version || 1}
                      {document.is_latest_version && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                          {t("latest")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {document.description && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">{t("description")}</h3>
                    <p className="text-sm whitespace-pre-wrap">{document.description}</p>
                  </div>
                )}
                
                {document.approval_status && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">{t("approvalStatus")}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-muted-foreground">{t("status")}</div>
                      <div className="text-sm">{t(document.approval_status)}</div>
                      {document.approved_at && (
                        <>
                          <div className="text-sm text-muted-foreground">
                            {document.approval_status === "approved" ? t("approvedOn") : t("reviewedOn")}
                          </div>
                          <div className="text-sm">{formatDateToLocal(document.approved_at)}</div>
                        </>
                      )}
                      {document.approval_notes && (
                        <>
                          <div className="text-sm text-muted-foreground">{t("notes")}</div>
                          <div className="text-sm whitespace-pre-wrap">{document.approval_notes}</div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="data-[state=active]:flex flex-col space-y-4">
            <div className="text-center text-muted-foreground p-8">
              <History className="h-12 w-12 mx-auto mb-2" />
              <p>{t("versionHistoryNotAvailable")}</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;
