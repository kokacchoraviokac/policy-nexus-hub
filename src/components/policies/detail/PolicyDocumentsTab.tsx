
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FilePlus, Download, Trash2, FileText, User, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface PolicyDocumentsTabProps {
  policyId: string;
}

interface PolicyDocument {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  created_at: string;
  uploaded_by: string;
  uploaded_by_name?: string; // Joined from profiles
  version: number;
}

const PolicyDocumentsTab: React.FC<PolicyDocumentsTabProps> = ({ policyId }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const { data: documents, isLoading, isError, refetch } = useQuery({
    queryKey: ['policy-documents', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_documents')
        .select(`
          *,
          profiles:uploaded_by (name)
        `)
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      return data.map(doc => ({
        ...doc,
        uploaded_by_name: doc.profiles?.name
      })) as PolicyDocument[];
    },
  });

  const handleUploadDocument = () => {
    // To be implemented - would open a file upload dialog
    toast({
      title: t("uploadFeature"),
      description: t("uploadFeatureNotImplemented"),
    });
  };

  const handleDownloadDocument = (document: PolicyDocument) => {
    // To be implemented - would download the document
    toast({
      title: t("downloadStarted"),
      description: t("downloadingDocument", { name: document.document_name }),
    });
  };

  const handleDeleteDocument = (document: PolicyDocument) => {
    // To be implemented - would delete the document
    toast({
      title: t("deleteConfirmation"),
      description: t("deleteDocumentConfirmation", { name: document.document_name }),
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">{t("policyDocuments")}</h3>
            <Button size="sm" disabled>
              <FilePlus className="mr-2 h-4 w-4" />
              {t("uploadDocument")}
            </Button>
          </div>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center py-6">
            <h3 className="text-lg font-medium text-destructive">{t("errorLoadingDocuments")}</h3>
            <p className="text-muted-foreground mt-2">{t("tryRefreshingPage")}</p>
            <Button className="mt-4" onClick={() => refetch()}>
              {t("refresh")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{t("policyDocuments")}</h3>
          <Button size="sm" onClick={handleUploadDocument} disabled={isUploading}>
            <FilePlus className="mr-2 h-4 w-4" />
            {isUploading ? t("uploading") : t("uploadDocument")}
          </Button>
        </div>

        {documents && documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((document) => (
              <div key={document.id} className="flex items-start justify-between border-b pb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-muted rounded-md">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{document.document_name}</h4>
                    <p className="text-sm text-muted-foreground">{document.document_type}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {document.uploaded_by_name || t("unknownUser")}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(document.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">{t("openMenu")}</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
                      <Download className="mr-2 h-4 w-4" />
                      {t("download")}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteDocument(document)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-md bg-muted/30">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-lg font-medium">{t("noDocumentsFound")}</h3>
            <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
              {t("noDocumentsDescription")}
            </p>
            <Button size="sm" onClick={handleUploadDocument}>
              <FilePlus className="mr-2 h-4 w-4" />
              {t("uploadDocument")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyDocumentsTab;
