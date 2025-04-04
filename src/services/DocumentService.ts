
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentCategory, DocumentApprovalStatus, EntityType } from "@/types/documents";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { v4 as uuidv4 } from "uuid";
import { ServiceResponse } from "@/types/services";

export const DocumentService = {
  async uploadDocument({
    document_name,
    document_type, 
    category,
    file_path,
    file_url,
    file_size,
    file_type,
    entity_id,
    entity_type,
    version = 1,
    original_document_id = null,
    metadata = "{}"
  }: Partial<Document> & {
    file_url?: string;
    file_size?: number;
    file_type?: string;
    metadata?: string;
  }): Promise<ServiceResponse<Document>> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { 
          success: false, 
          error: "User not authenticated" 
        };
      }
      
      // Get the user's company ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.company_id) {
        return { 
          success: false, 
          error: "User's company ID not found" 
        };
      }
      
      const tableName = getDocumentTableName(entity_type);
      
      // Create the document record
      const documentData = {
        id: uuidv4(),
        document_name,
        document_type,
        category: category || 'other',
        file_path,
        mime_type: file_type,
        uploaded_by: user.id,
        company_id: profile.company_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version,
        is_latest_version: true,
        original_document_id
      };
      
      // Add entity-specific fields based on the entity type
      if (entity_type === 'policy') {
        Object.assign(documentData, { policy_id: entity_id });
      } else if (entity_type === 'claim') {
        Object.assign(documentData, { claim_id: entity_id });
      } else if (entity_type === 'sales_process') {
        Object.assign(documentData, { 
          sales_process_id: entity_id,
          step: document_type || 'general'
        });
      }
      
      const { data, error } = await supabase
        .from(tableName)
        .insert(documentData)
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        success: true,
        data: data as Document
      };
      
    } catch (error) {
      console.error("Error uploading document:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  },

  async getDocuments(entityType: EntityType, entityId: string): Promise<ServiceResponse<Document[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { 
          success: false, 
          error: "User not authenticated" 
        };
      }
      
      const tableName = getDocumentTableName(entityType);
      
      // Create a query based on the entity type
      let query = supabase
        .from(tableName)
        .select("*");
        
      // Add the entity-specific filter
      if (entityType === 'policy') {
        query = query.eq('policy_id', entityId);
      } else if (entityType === 'claim') {
        query = query.eq('claim_id', entityId);
      } else if (entityType === 'sales_process') {
        query = query.eq('sales_process_id', entityId);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return {
        success: true,
        data: data as unknown as Document[]
      };
      
    } catch (error) {
      console.error("Error getting documents:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  },

  async getDocumentSignedUrl(filePath: string): Promise<ServiceResponse<string>> {
    try {
      if (!filePath) throw new Error("File path is required");
      
      const { data: { signedUrl }, error } = await supabase
        .storage
        .from('documents')
        .createSignedUrl(filePath, 60 * 60); // URL valid for 1 hour
        
      if (error) throw error;
      if (!signedUrl) throw new Error("Unable to generate signed URL");
      
      return {
        success: true,
        data: signedUrl
      };
      
    } catch (error) {
      console.error("Error getting document signed URL:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  },

  async getDocumentVersions(documentId: string, entityType: EntityType): Promise<ServiceResponse<Document[]>> {
    try {
      const tableName = getDocumentTableName(entityType);
      
      // Find the original document first
      const { data: document, error: docError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', documentId)
        .single();
        
      if (docError) throw docError;
      
      // Get the original document ID or use the current document ID if it's the original
      const originalId = document.original_document_id || document.id;
      
      // Get all versions
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .or(`id.eq.${originalId},original_document_id.eq.${originalId}`)
        .order('version', { ascending: false });
        
      if (error) throw error;
      
      return {
        success: true,
        data: data as unknown as Document[]
      };
      
    } catch (error) {
      console.error("Error getting document versions:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  },

  async deleteDocument(documentId: string): Promise<ServiceResponse<boolean>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { 
          success: false, 
          error: "User not authenticated" 
        };
      }
      
      // First, we need to find the document to get its entity type
      // We'll try each table
      const entityTypes: EntityType[] = ['policy', 'claim', 'sales_process'];
      let documentFound = false;
      let filePath: string | null = null;
      
      for (const entityType of entityTypes) {
        const tableName = getDocumentTableName(entityType);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('file_path')
          .eq('id', documentId)
          .maybeSingle();
          
        if (!error && data) {
          documentFound = true;
          filePath = data.file_path;
          
          // Delete the document from the database
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .eq('id', documentId);
            
          if (deleteError) throw deleteError;
          break;
        }
      }
      
      if (!documentFound) {
        return {
          success: false,
          error: "Document not found"
        };
      }
      
      // If we have a file path, delete the file from storage
      if (filePath) {
        const { error: storageError } = await supabase
          .storage
          .from('documents')
          .remove([filePath]);
          
        if (storageError) {
          console.warn("Error deleting file from storage:", storageError);
          // We won't fail the entire operation if storage delete fails
        }
      }
      
      return {
        success: true,
        data: true
      };
      
    } catch (error) {
      console.error("Error deleting document:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  },

  async approveDocument(
    documentId: string, 
    status: DocumentApprovalStatus,
    notes?: string
  ): Promise<ServiceResponse<Document>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { 
          success: false, 
          error: "User not authenticated" 
        };
      }
      
      // First, find the document to get its entity type
      const entityTypes: EntityType[] = ['policy', 'claim', 'sales_process'];
      let documentFound = false;
      let updatedDocument = null;
      
      for (const entityType of entityTypes) {
        const tableName = getDocumentTableName(entityType);
        
        const { data: document, error: findError } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', documentId)
          .maybeSingle();
          
        if (!findError && document) {
          documentFound = true;
          
          // Update the document with approval status
          const { data, error: updateError } = await supabase
            .from(tableName)
            .update({
              approval_status: status,
              approval_notes: notes,
              approved_by: user.id,
              approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', documentId)
            .select()
            .single();
            
          if (updateError) throw updateError;
          updatedDocument = data;
          break;
        }
      }
      
      if (!documentFound) {
        return {
          success: false,
          error: "Document not found"
        };
      }
      
      return {
        success: true,
        data: updatedDocument as unknown as Document
      };
      
    } catch (error) {
      console.error("Error approving document:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
};
