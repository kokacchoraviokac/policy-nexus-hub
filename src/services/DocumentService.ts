
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentApprovalStatus, EntityType } from "@/types/documents";
import { ServiceResponse } from "@/types/services";
import { getDocumentTableName } from "@/utils/documentUploadUtils";
import { entityTablesMap } from "./documentTypes";

export class DocumentService {
  // Create a document entry in the database
  static async createDocument(documentData: Partial<Document>): Promise<ServiceResponse<Document>> {
    try {
      const tableName = getDocumentTableName(documentData.entity_type as EntityType);
      
      // @ts-ignore - Supabase table might not exist in type definition
      const { data, error } = await supabase.from(tableName).insert(documentData).select().single();
      
      if (error) throw error;
      
      return { success: true, data: data as Document };
    } catch (error) {
      console.error("Error creating document:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error("Failed to create document") 
      };
    }
  }
  
  // Get a document by ID
  static async getDocument(documentId: string, entityType: EntityType): Promise<ServiceResponse<Document>> {
    try {
      const tableName = getDocumentTableName(entityType);
      
      // @ts-ignore - Supabase table might not exist in type definition
      const { data, error } = await supabase.from(tableName).select('*').eq('id', documentId).single();
      
      if (error) throw error;
      
      return { success: true, data: data as Document };
    } catch (error) {
      console.error("Error retrieving document:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error("Failed to retrieve document") 
      };
    }
  }
  
  // Get all documents for a specific entity
  static async getDocuments(entityType: EntityType, entityId: string): Promise<ServiceResponse<Document[]>> {
    try {
      const tableName = getDocumentTableName(entityType);
      const entityIdColumn = `${entityType}_id`;
      
      const query = supabase
        // @ts-ignore - Supabase table might not exist in type definition
        .from(tableName)
        .select('*')
        .eq(entityIdColumn, entityId);
      
      // If we're looking for non-addendum policy documents
      if (entityType === 'policy' && entityIdColumn === 'policy_id') {
        query.is('addendum_id', null);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { success: true, data: data as Document[] };
    } catch (error) {
      console.error("Error retrieving documents:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error("Failed to retrieve documents") 
      };
    }
  }
  
  // Delete a document
  static async deleteDocument(documentId: string, entityType: EntityType): Promise<ServiceResponse<null>> {
    try {
      const tableName = getDocumentTableName(entityType);
      
      // First, we need to get the document to know its storage path
      // @ts-ignore - Supabase table might not exist in type definition
      const { data: document, error: fetchError } = await supabase
        .from(tableName)
        .select('file_path')
        .eq('id', documentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete from storage if file_path exists
      if (document && document.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);
          
        if (storageError) {
          console.warn("Could not delete document from storage:", storageError);
          // Continue anyway to delete the database record
        }
      }
      
      // Delete from database
      // @ts-ignore - Supabase table might not exist in type definition
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', documentId);
        
      if (deleteError) throw deleteError;
      
      return { success: true, data: null };
    } catch (error) {
      console.error("Error deleting document:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error("Failed to delete document") 
      };
    }
  }
  
  // Get document versions
  static async getDocumentVersions(documentId: string, entityType: EntityType): Promise<ServiceResponse<Document[]>> {
    try {
      const tableName = getDocumentTableName(entityType);
      
      // First get the original document ID
      // @ts-ignore - Supabase table might not exist in type definition
      const { data: document, error: fetchError } = await supabase
        .from(tableName)
        .select('original_document_id, id')
        .eq('id', documentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const originalId = document.original_document_id || document.id;
      
      // Then get all versions
      // @ts-ignore - Supabase table might not exist in type definition
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .or(`id.eq.${originalId},original_document_id.eq.${originalId}`)
        .order('version', { ascending: true });
        
      if (error) throw error;
      
      return { success: true, data: data as Document[] };
    } catch (error) {
      console.error("Error retrieving document versions:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error("Failed to retrieve document versions") 
      };
    }
  }
  
  // Update document approval status
  static async updateDocumentApproval(
    documentId: string,
    entityType: EntityType,
    status: DocumentApprovalStatus,
    notes: string,
    userId: string
  ): Promise<ServiceResponse<Document>> {
    try {
      const tableName = getDocumentTableName(entityType);
      
      const updateData = {
        approval_status: status,
        approval_notes: notes,
        approved_by: userId,
        approved_at: new Date().toISOString()
      };
      
      // @ts-ignore - Supabase table might not exist in type definition
      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', documentId)
        .select()
        .single();
        
      if (error) throw error;
      
      return { success: true, data: data as Document };
    } catch (error) {
      console.error("Error updating document approval:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error("Failed to update document approval") 
      };
    }
  }
  
  static async searchDocuments(
    searchParams: {
      searchTerm?: string;
      entityType?: EntityType;
      entityId?: string;
      documentType?: string;
      category?: string;
      page?: number;
      pageSize?: number;
    }
  ): Promise<ServiceResponse<{ documents: Document[], totalCount: number }>> {
    try {
      const { 
        searchTerm = '',
        entityType,
        entityId,
        documentType,
        category,
        page = 1,
        pageSize = 10
      } = searchParams;
      
      // In a real implementation, this would be a stored procedure or a view
      // that combines documents from all related tables
      // For simplicity in this example, we'll just search in a specific table if provided
      
      let query;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      
      if (entityType) {
        const tableName = getDocumentTableName(entityType);
        // @ts-ignore - Supabase table might not exist in type definition
        query = supabase.from(tableName).select('*', { count: 'exact' });
        
        if (entityId) {
          const entityIdColumn = `${entityType}_id`;
          query = query.eq(entityIdColumn, entityId);
        }
      } else {
        // In a real implementation, we'd have a view that combines all document tables
        // For this example, we'll just use a theoretical documents_view
        // @ts-ignore - Supabase view might not exist in type definition
        query = supabase.from('documents_view').select('*', { count: 'exact' });
      }
      
      // Apply filters
      if (searchTerm) {
        query = query.or(`document_name.ilike.%${searchTerm}%,document_type.ilike.%${searchTerm}%`);
      }
      
      if (documentType) {
        query = query.eq('document_type', documentType);
      }
      
      if (category) {
        query = query.eq('category', category);
      }
      
      // Apply pagination
      query = query.range(startIndex, endIndex).order('created_at', { ascending: false });
      
      // Execute the query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return { 
        success: true, 
        data: { 
          documents: data as Document[], 
          totalCount: count || 0 
        } 
      };
    } catch (error) {
      console.error("Error searching documents:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error("Failed to search documents") 
      };
    }
  }
}
