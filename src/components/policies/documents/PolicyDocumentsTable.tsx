
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Download, EyeIcon, Trash2, Loader2, FileText, FileImage, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { useToast } from "@/hooks/use-toast";
import DeleteDocumentDialog from "@/components/documents/DeleteDocumentDialog";
import { Document } from "@/hooks/useDocuments";

interface PolicyDocumentsTableProps {
  searchTerm?: string;
  documentType?: string;
  limit?: number;
}

const PolicyDocumentsTable: React.FC<PolicyDocumentsTableProps> = ({ 
  searchTerm = "", 
  documentType,
  limit = 10
}) => {
  const { t, formatDate } = useLanguage();
  const { toast } = useToast();
  const { isDownloading, downloadDocument } = useDocumentDownload();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  // Query to fetch policy documents
  const { data: documents, isLoading, error, refetch } = useQuery({
    queryKey: ['global-policy-documents', searchTerm, documentType],
    queryFn: async () => {
      // Start with a base query
      let query = supabase
        .from('policy_documents')
        .select(`
          id,
          document_name,
          document_type,
          file_path,
          created_at,
          uploaded_by,
          policy_id,
          version
        `)
        .order('created_at', { ascending: false });
      
      // Add filters based on props
      if (searchTerm) {
        query = query.ilike('document_name', `%${searchTerm}%`);
      }
      
      if (documentType) {
        query = query.eq('document_type', documentType);
      }
      
      // Limit the number of results
      query = query.limit(limit);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Format documents to match our Document type
      return data.map(doc => ({
        id: doc.id,
        document_name: doc.document_name,
        document_type: doc.document_type,
        file_path: doc.file_path,
        created_at: doc.created_at,
        uploaded_by_id: doc.uploaded_by,
        entity_type: "policy",
        entity_id: doc.policy_id || "global",
        version: doc.version || 1,
        is_latest_version: true
      })) as Document[];
    }
  });
  
  const handleDownload = (document: Document) => {
    downloadDocument(document);
  };
  
  const openDeleteDialog = (document: Document) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedDocument) return;
    
    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([selectedDocument.file_path]);
        
      if (storageError) throw storageError;
      
      // Delete record from database
      const { error: dbError } = await supabase
        .from('policy_documents')
        .delete()
        .eq('id', selectedDocument.id);
        
      if (dbError) throw dbError;
      
      toast({
        title: t("documentDeleted"),
        description: t("documentDeletedSuccess"),
      });
      
      // Refresh the list
      refetch();
      
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: t("documentDeleteError"),
        description: t("documentDeleteErrorMessage"),
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
    }
  };
  
  const getDocumentIcon = (document: Document) => {
    const filePath = document.file_path.toLowerCase();
    
    if (filePath.endsWith('.pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (filePath.endsWith('.xls') || filePath.endsWith('.xlsx') || filePath.endsWith('.csv')) {
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-destructive font-medium">{t("errorLoadingDocuments")}</p>
        <p className="text-muted-foreground text-sm mt-1">{t("pleaseTryAgainLater")}</p>
      </Card>
    );
  }
  
  if (!documents || documents.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="font-medium">{t("noDocumentsFound")}</p>
        <p className="text-muted-foreground text-sm mt-1">{t("tryDifferentFilters")}</p>
      </Card>
    );
  }
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>{t("documentName")}</TableHead>
            <TableHead>{t("documentType")}</TableHead>
            <TableHead>{t("uploadDate")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell>{getDocumentIcon(document)}</TableCell>
              <TableCell className="font-medium">{document.document_name}</TableCell>
              <TableCell>
                <Badge variant="outline">{document.document_type}</Badge>
              </TableCell>
              <TableCell>{formatDate(document.created_at)}</TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDownload(document)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? 
                          <Loader2 className="h-4 w-4 animate-spin" /> :
                          <Download className="h-4 w-4" />
                        }
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("download")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openDeleteDialog(document)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("delete")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <DeleteDocumentDialog
        document={selectedDocument}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default PolicyDocumentsTable;
