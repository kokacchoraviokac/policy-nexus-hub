
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, Loader2, FileText, Trash2 } from "lucide-react";
import { PolicyDocument } from "@/hooks/usePolicyDocuments";
import DeleteDocumentDialog from "@/components/policies/detail/document/DeleteDocumentDialog";

interface PolicyDocumentsTableProps {
  searchTerm: string;
  documentType: string;
}

const PolicyDocumentsTable: React.FC<PolicyDocumentsTableProps> = ({ 
  searchTerm, 
  documentType 
}) => {
  const { t, formatDate } = useLanguage();
  const { toast } = useToast();
  const [documentToDelete, setDocumentToDelete] = useState<PolicyDocument | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ['all-policy-documents', searchTerm, documentType],
    queryFn: async () => {
      let query = supabase
        .from('policy_documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (documentType !== 'all') {
        query = query.eq('document_type', documentType);
      }
      
      if (searchTerm) {
        query = query.ilike('document_name', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as PolicyDocument[];
    }
  });
  
  const handleDownload = async (document: PolicyDocument) => {
    if (!document.file_path) {
      toast({
        title: t("downloadFailed"),
        description: t("documentPathMissing"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsDownloading(true);
      
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);
        
      if (error) throw error;
      
      // Create a URL for the blob
      const url = URL.createObjectURL(data);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = document.document_name || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Free up the URL
      URL.revokeObjectURL(url);
      
      toast({
        title: t("downloadStarted"),
        description: t("documentDownloadStarted"),
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: t("downloadFailed"),
        description: t("errorOccurred"),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      // First delete the file from storage if exists
      if (documentToDelete.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([documentToDelete.file_path]);
          
        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
          // Continue to delete the record even if storage deletion fails
        }
      }
      
      // Delete the document record
      const { error } = await supabase
        .from('policy_documents')
        .delete()
        .eq('id', documentToDelete.id);
        
      if (error) throw error;
      
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccess"),
      });
      
      // Refresh the documents list
      refetch();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: t("documentDeleteError"),
        description: t("documentDeleteErrorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };
  
  const confirmDelete = (document: PolicyDocument) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };
  
  const viewPolicyDetails = (policyId: string) => {
    if (policyId) {
      window.location.href = `/policies/${policyId}`;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="mx-auto h-12 w-12 mb-2 opacity-20" />
        <p>{searchTerm || documentType !== 'all' ? t("noMatchingDocuments") : t("noDocuments")}</p>
      </div>
    );
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("documentName")}</TableHead>
            <TableHead>{t("documentType")}</TableHead>
            <TableHead>{t("uploadedAt")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.document_name}</TableCell>
              <TableCell>{t(document.document_type)}</TableCell>
              <TableCell>{formatDate(document.created_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {document.policy_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewPolicyDetails(document.policy_id as string)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(document)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDelete(document)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <DeleteDocumentDialog
        document={documentToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteDocument}
      />
    </div>
  );
};

export default PolicyDocumentsTable;
