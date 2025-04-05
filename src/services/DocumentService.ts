
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentApprovalStatus, EntityType } from "@/types/documents";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { ServiceResponse } from "@/types/services";

export class DocumentService {
  /**
   * Create a new document
   */
  static async createDocument(document: Partial<Document>): Promise<ServiceResponse<Document>> {
    try {
      const tableName = getDocumentTableName(document.entity_type as EntityType);
      
      // Use type assertion to prevent TypeScript errors about table names
      const { data, error } = await supabase
        .from(tableName as any)
        .insert({
          document_name: document.document_name,
          document_type: document.document_type,
          category: document.category,
          file_path: document.file_path,
          uploaded_by: document.uploaded_by,
          company_id: document.company_id,
          // Include entity-specific ID field based on entity type
          ...(document.entity_type === 'policy' && { policy_id: document.entity_id }),
          ...(document.entity_type === 'claim' && { claim_id: document.entity_id }),
          ...(document.entity_type === 'sales_process' && { sales_process_id: document.entity_id }),
          is_latest_version: true,
          version: 1
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        data: data as Document
      };
    } catch (error) {
      console.error("Error creating document:", error);
      return {
        success: false,
        error: error as Error
      };
    }
  }
  
  /**
   * Get all documents for a specific entity
   */
  static async getDocuments(entityType: EntityType, entityId: string): Promise<ServiceResponse<Document[]>> {
    try {
      const tableName = getDocumentTableName(entityType);
      let query;
      
      // Use type assertion to prevent TypeScript errors about table names
      if (entityType === 'policy') {
        query = supabase
          .from(tableName as any)
          .select('*')
          .eq('policy_id', entityId);
      } else if (entityType === 'claim') {
        query = supabase
          .from(tableName as any)
          .select('*')
          .eq('claim_id', entityId);
      } else if (entityType === 'sales_process') {
        query = supabase
          .from(tableName as any)
          .select('*')
          .eq('sales_process_id', entityId);
      } else {
        // Error case - unsupported entity type
        throw new Error(`Unsupported entity type: ${entityType}`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return {
        success: true,
        data: (data || []) as Document[]
      };
    } catch (error) {
      console.error("Error getting documents:", error);
      return {
        success: false,
        error: error as Error
      };
    }
  }
  
  /**
   * Get a specific document by ID
   */
  static async getDocument(documentId: string, entityType: EntityType): Promise<ServiceResponse<Document>> {
    try {
      const tableName = getDocumentTableName(entityType);
      
      // Use type assertion to prevent TypeScript errors about table names
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (error) throw error;
      
      // Get signed URL for file if file_path exists
      if (data && data.file_path) {
        const { data: urlData, error: urlError } = await supabase
          .storage
          .from('documents')
          .createSignedUrl(data.file_path, 60 * 60); // 1 hour expiry
        
        if (urlError) throw urlError;
        
        data.file_url = urlData.signedUrl;
      }
      
      return {
        success: true,
        data: data as Document
      };
    } catch (error) {
      console.error("Error getting document:", error);
      return {
        success: false,
        error: error as Error
      };
    }
  }
  
  /**
   * Get all versions of a document
   */
  static async getDocumentVersions(documentId: string): Promise<ServiceResponse<Document[]>> {
    try {
      // First get the original document to determine the type and original ID
      const { data: document, error } = await supabase
        .from('documents_view')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (error) throw error;
      
      const originalId = document.original_document_id || document.id;
      const tableName = getDocumentTableName(document.entity_type as EntityType);
      
      // Use type assertion to prevent TypeScript errors about table names
      const { data, error: versionsError } = await supabase
        .from(tableName as any)
        .select('*')
        .or(`id.eq.${originalId},original_document_id.eq.${originalId}`)
        .order('version', { ascending: false });
      
      if (versionsError) throw versionsError;
      
      return {
        success: true,
        data: (data || []) as Document[]
      };
    } catch (error) {
      console.error("Error getting document versions:", error);
      return {
        success: false,
        error: error as Error
      };
    }
  }
  
  /**
   * Delete a document
   */
  static async deleteDocument(documentId: string): Promise<ServiceResponse<boolean>> {
    try {
      // First get the document to determine which table to delete from
      const { data: document, error: fetchError } = await supabase
        .from('documents_view')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const tableName = getDocumentTableName(document.entity_type as EntityType);
      
      // Delete the document record
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
      
      // Delete the file from storage if file_path exists
      if (document.file_path) {
        const { error: storageError } = await supabase
          .storage
          .from('documents')
          .remove([document.file_path]);
        
        if (storageError) {
          console.warn("Failed to delete file from storage:", storageError);
          // Continue anyway, since the database record is deleted
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
        error: error as Error
      };
    }
  }
  
  /**
   * Update document approval status
   */
  static async updateDocumentStatus(
    documentId: string,
    status: DocumentApprovalStatus,
    notes?: string
  ): Promise<ServiceResponse<Document>> {
    try {
      // First get the document to determine which table to update
      const { data: document, error: fetchError } = await supabase
        .from('documents_view')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const tableName = getDocumentTableName(document.entity_type as EntityType);
      
      // Update the document with approval information
      const { data, error } = await supabase
        .from(tableName as any)
        .update({
          approval_status: status,
          approval_notes: notes,
          approved_by: (await supabase.auth.getUser()).data.user?.id,
          approved_at: new Date().toISOString()
        } as any)
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        data: data as Document
      };
    } catch (error) {
      console.error("Error updating document status:", error);
      return {
        success: false,
        error: error as Error
      };
    }
  }
}

export default DocumentService;
