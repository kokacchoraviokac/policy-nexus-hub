
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUp, FilePlus, FileText, Download, Trash2 } from "lucide-react";
import { formatRelative } from "date-fns";

interface PolicyDocumentsTabProps {
  policyId: string;
}

interface PolicyDocument {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  uploaded_by_id?: string;
  uploaded_by_name?: string;
}

const PolicyDocumentsTab: React.FC<PolicyDocumentsTabProps> = ({ policyId }) => {
  const { t, formatDate } = useLanguage();
  const { toast } = useToast();
  
  const { data: documents, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['policy-documents', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_documents')
        .select(`
          id,
          document_name,
          document_type,
          created_at,
          file_path,
          uploaded_by
        `)
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch uploader names
      const uploaderIds = data.map(doc => doc.uploaded_by).filter(Boolean);
      
      if (uploaderIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', uploaderIds);
          
        if (!profilesError && profiles) {
          const profileMap = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile.name;
            return acc;
          }, {} as Record<string, string>);
          
          // Attach uploader names to documents
          return data.map(doc => ({
            ...doc,
            uploaded_by_id: doc.uploaded_by,
            uploaded_by_name: doc.uploaded_by ? profileMap[doc.uploaded_by] || t("unknownUser") : t("system")
          }));
        }
      }
      
      return data.map(doc => ({
        ...doc,
        uploaded_by_id: doc.uploaded_by,
        uploaded_by_name: t("unknownUser")
      }));
    }
  });

  const handleUploadDocument = () => {
    // To be implemented
    toast({
      title: t("uploadStarted"),
      description: t("documentUploadInProgress"),
    });
  };

  const handleDownloadDocument = (document: PolicyDocument) => {
    // To be implemented
    toast({
      title: t("downloadStarted"),
      description: t("documentDownloadInProgress"),
    });
  };

  const handleDeleteDocument = (document: PolicyDocument) => {
    // To be implemented
    toast({
      title: t("deletionStarted"),
      description: t("documentDeletionInProgress"),
    });
  };

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
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{t("policyDocuments")}</h3>
          <Button onClick={handleUploadDocument}>
            <FileUp className="mr-2 h-4 w-4" />
            {t("uploadDocument")}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="divide-y">
            {documents.map((document) => (
              <div key={document.id} className="py-4 flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <FileText className="h-6 w-6 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{document.document_name}</p>
                    <div className="text-sm text-muted-foreground">
                      <span className="mr-3">{document.document_type}</span>
                      <span>{formatDate(document.created_at)}</span>
                    </div>
                    <p className="text-xs mt-1">
                      {t("uploadedBy")}: {document.uploaded_by_name}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownloadDocument(document)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteDocument(document)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">{t("noDocumentsFound")}</h3>
            <p className="text-muted-foreground mt-2">{t("uploadFirstDocument")}</p>
            <Button className="mt-4" onClick={handleUploadDocument}>
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
