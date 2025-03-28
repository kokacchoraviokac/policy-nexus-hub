
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export type EntityType = "policy" | "claim" | "client" | "insurer" | "sales_process" | "agent";

export interface Document {
  id: string;
  document_name: string;
  document_type: string;
  created_at: string;
  file_path: string;
  entity_type: EntityType;
  entity_id: string;
  uploaded_by_id?: string;
  uploaded_by_name?: string;
  version?: number;
  is_latest_version?: boolean;
  original_document_id?: string; // For versioning - references the first version of a document
  mime_type?: string;
  file_size?: number;
  tags?: string[];
}

interface UseDocumentsProps {
  entityType: EntityType;
  entityId: string;
}

export const useDocuments = ({ entityType, entityId }: UseDocumentsProps) => {
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const queryClient = useQueryClient();
  const { formatDate } = useLanguage();
  
  const documentsKey = ['documents', entityType, entityId];
  
  // Fetch documents
  const {
    data: documents,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: documentsKey,
    queryFn: async () => {
      // Default to latest versions only
      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          document_name,
          document_type,
          created_at,
          file_path,
          entity_type,
          entity_id,
          version,
          is_latest_version,
          original_document_id,
          mime_type,
          file_size,
          tags,
          uploaded_by
        `)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('is_latest_version', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch uploader names
      const uploaderIds = data
        .map(doc => doc.uploaded_by)
        .filter(Boolean);
      
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
            uploaded_by_name: doc.uploaded_by ? profileMap[doc.uploaded_by] || 'Unknown user' : 'System'
          }));
        }
      }
      
      return data.map(doc => ({
        ...doc,
        uploaded_by_id: doc.uploaded_by,
        uploaded_by_name: 'Unknown user'
      }));
    }
  });

  // Fetch document versions
  const fetchDocumentVersions = async (originalDocumentId: string) => {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        id,
        document_name,
        document_type,
        created_at,
        file_path,
        version,
        uploaded_by,
        is_latest_version
      `)
      .eq('original_document_id', originalDocumentId)
      .order('version', { ascending: false });
    
    if (error) {
      toast({
        title: "Error fetching versions",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    return data;
  };

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (document: Document) => {
      // Delete from storage first
      if (document.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);
          
        if (storageError) throw storageError;
      }
      
      // If this is the original document or latest version and has versions,
      // delete all versions
      if (document.original_document_id || !document.version) {
        const documentId = document.original_document_id || document.id;
        
        // Delete all versions from the database
        const { error: dbError } = await supabase
          .from('documents')
          .delete()
          .or(`original_document_id.eq.${documentId},id.eq.${documentId}`);
          
        if (dbError) throw dbError;
      } else {
        // Delete just this version from the database
        const { error: dbError } = await supabase
          .from('documents')
          .delete()
          .eq('id', document.id);
          
        if (dbError) throw dbError;
      }
      
      return document;
    },
    onSuccess: (document) => {
      // Refresh documents list
      queryClient.invalidateQueries({ queryKey: documentsKey });
      
      // Log activity
      logActivity({
        entityType: entityType,
        entityId: entityId,
        action: "update",
        details: { 
          action_type: "document_delete",
          document_name: document.document_name,
          document_id: document.id
        }
      });
      
      toast({
        title: "Document deleted",
        description: "Document was successfully deleted",
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Deletion failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  });

  // Download document
  const downloadDocument = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);
        
      if (error) throw error;
      
      // Create a download link and click it
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.document_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      
      // Log activity
      logActivity({
        entityType: entityType,
        entityId: entityId,
        action: "update",
        details: { 
          action_type: "document_download",
          document_name: document.document_name,
          document_id: document.id
        }
      });
      
      toast({
        title: "Download started",
        description: "Document download has started",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return {
    documents,
    isLoading,
    isError,
    error,
    refetch,
    deleteDocument: deleteDocumentMutation.mutate,
    downloadDocument,
    fetchDocumentVersions
  };
};
