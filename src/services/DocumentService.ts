
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentApprovalStatus, EntityType } from "@/types/documents";
import { ServiceResponse } from "@/types/services";
import { getDocumentTableName } from "@/utils/documentUploadUtils";

export class DocumentService {
  // Create a document entry in the database
  static async createDocument(documentData: Partial<Document>): Promise<ServiceResponse<Document>> {
    try {
      const tableName = getDocumentTableName(documentData.entity_type as EntityType);
      
      // Use type assertion to handle the table name
      const { data, error } = await supabase
        .from(tableName)
        .insert(documentData)
        .select()
        .single();
      
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
      
      // Use type assertion to handle the table name
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', documentId)
        .single();
      
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
      
      // Create the base query with type assertion
      const query = supabase
        .from(tableName)
        .select('*');
      
      // Add entity ID filter
      const filteredQuery = query.eq(entityIdColumn, entityId);
      
      // If we're looking for non-addendum policy documents
      if (entityType === 'policy' && entityIdColumn === 'policy_id') {
        filteredQuery.is('addendum_id', null);
      }
      
      const { data, error } = await filteredQuery;
      
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
      
      // Delete from database with type assertion
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
      const { data: document, error: fetchError } = await supabase
        .from(tableName)
        .select('original_document_id, id')
        .eq('id', documentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const originalId = document.original_document_id || document.id;
      
      // Then get all versions with type assertion
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
      
      // Use type assertion for the update operation
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
  
  // Search documents across all document tables with pagination
  static async searchDocuments(
    searchParams: {
      searchTerm?: string;
      entityType?: EntityType;
      entityId?: string;
      documentType?: string;
      category?: string;
      page?: number;
      pageSize?: number;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<ServiceResponse<{ documents: Document[], totalCount: number }>> {
    try {
      const { 
        searchTerm = '',
        entityType,
        entityId,
        documentType,
        category,
        status,
        page = 1,
        pageSize = 10,
        dateFrom,
        dateTo
      } = searchParams;
      
      // Since we don't have a view that consolidates all document tables,
      // we need to target a specific table based on entity type
      if (!entityType) {
        throw new Error("Entity type is required for document search");
      }

      const tableName = getDocumentTableName(entityType);
      const entityIdColumn = `${entityType}_id`;
      
      // Base query
      const query = supabase
        .from(tableName)
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (entityId) {
        query.eq(entityIdColumn, entityId);
      }
      
      if (searchTerm) {
        query.or(`document_name.ilike.%${searchTerm}%,document_type.ilike.%${searchTerm}%`);
      }
      
      if (documentType) {
        query.eq('document_type', documentType);
      }
      
      if (category) {
        query.eq('category', category);
      }
      
      if (status) {
        query.eq('status', status);
      }
      
      if (dateFrom) {
        query.gte('created_at', dateFrom);
      }
      
      if (dateTo) {
        query.lte('created_at', dateTo);
      }
      
      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      query.range(startIndex, startIndex + pageSize - 1).order('created_at', { ascending: false });
      
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
