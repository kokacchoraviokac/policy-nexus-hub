
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/documents";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Download, FileText, File, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDateToLocal } from "@/utils/dateUtils";
import DocumentPdfViewer from "./DocumentPdfViewer";

interface DocumentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document;
}

const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  open,
  onOpenChange,
  document,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (open && document) {
      setIsLoading(true);
      fetchDocumentUrl();
    }
  }, [open, document]);

  const fetchDocumentUrl = async () => {
    try {
      if (!document.file_path) {
        throw new Error("Document has no file path");
      }

      const { data } = supabase.storage
        .from("documents")
        .getPublicUrl(document.file_path);

      if (!data || !data.publicUrl) {
        throw new Error("Could not get document URL");
      }

      setDocumentUrl(data.publicUrl);
    } catch (error) {
      console.error("Error fetching document:", error);
      toast({
        title: t("errorLoadingDocument"),
        description: t("couldNotLoadDocumentPleaseTryAgain"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDocument = async () => {
    try {
      if (!document.file_path) {
        throw new Error("Document has no file path");
      }

      const { data, error } = await supabase.storage
        .from("documents")
        .download(document.file_path);

      if (error) {
        throw error;
      }

      // Create a URL for the blob and trigger a download
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = document.document_name || "document";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: t("downloadStarted"),
        description: t("documentIsBeingDownloaded"),
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: t("downloadFailed"),
        description: t("couldNotDownloadDocumentPleaseTryAgain"),
        variant: "destructive",
      });
    }
  };

  const renderDocumentPreview = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!documentUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t("documentPreviewNotAvailable")}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            {t("documentPreviewNotAvailableDescription")}
          </p>
        </div>
      );
    }

    // Check if document is a PDF
    if (document.mime_type?.includes("pdf") || document.document_type?.includes("pdf")) {
      return <DocumentPdfViewer url={documentUrl} className="w-full h-96" />;
    }

    // Check if document is an image
    if (document.mime_type?.includes("image")) {
      return (
        <div className="flex justify-center">
          <img 
            src={documentUrl} 
            alt={document.document_name} 
            className="max-h-96 object-contain" 
          />
        </div>
      );
    }

    // Default file icon for other types
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <File className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-lg font-medium">{document.document_name}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t("fileCannotBePreviewedDownloadToView")}
        </p>
        <Button 
          onClick={downloadDocument} 
          className="mt-4" 
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          {t("download")}
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{document.document_name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Document preview takes 2/3 of the space on wider screens */}
          <div className="md:col-span-2 border rounded-lg p-2 bg-muted/20">
            {renderDocumentPreview()}
          </div>

          {/* Document details take 1/3 of the space */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <h4 className="text-sm font-medium">{t("documentType")}</h4>
                <p className="text-sm text-muted-foreground">{document.document_type}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">{t("uploadedBy")}</h4>
                <p className="text-sm text-muted-foreground">
                  {document.uploaded_by_name || t("unknownUser")}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium">{t("uploadedOn")}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDateToLocal(document.created_at)}
                </p>
              </div>

              {document.category && (
                <div>
                  <h4 className="text-sm font-medium">{t("category")}</h4>
                  <p className="text-sm text-muted-foreground">{t(document.category)}</p>
                </div>
              )}

              {document.version && (
                <div>
                  <h4 className="text-sm font-medium">{t("version")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {document.version}
                    {document.is_latest_version && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                        {t("latest")}
                      </span>
                    )}
                  </p>
                </div>
              )}
              
              {document.comments && document.comments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">{t("comments")}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                    {document.comments.map((comment, index) => (
                      <li key={index} className="bg-muted/30 p-2 rounded">
                        {comment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button 
              onClick={downloadDocument} 
              className="w-full" 
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {t("downloadDocument")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;
