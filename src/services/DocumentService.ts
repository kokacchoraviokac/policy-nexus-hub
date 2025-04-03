import { BaseService, ServiceResponse } from "./BaseService";
import { Document, DocumentCategory, EntityType, DocumentApprovalStatus } from "@/types/documents";

/**
 * Document upload parameters
 */
export interface DocumentUploadParams {
  file: File;
  documentName: string;
  documentType: string;
  category: DocumentCategory | string;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string | null;
  currentVersion?: number;
  additionalData?: Record<string, any>;
}

/**
 * Document service responsible for all document operations
 */
export class DocumentService extends BaseService {
  /**
   * Upload a document
   */
  static async uploadDocument(params: DocumentUploadParams): Promise<ServiceResponse<Document>> {
    try {
      const { 
        file, 
        documentName, 
        documentType, 
        category, 
        entityId, 
        entityType,
        originalDocumentId,
        currentVersion = 0,
        additionalData = {}
      } = params;

      // Generate a unique file path for this document
      const fileExt = file.name.split('.').pop() || "";
      const filePath = `${entityType}/${entityId}/${Date.now()}.${fileExt}`;
      
      // Create storage instance
      const service = new DocumentService();
      const supabase = service.getClient();
      
      // Upload the file to storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        throw storageError;
      }

      // Get public URL for the file
      const { data: { publicUrl } } = supabase
        .storage
        .from('documents')
        .getPublicUrl(filePath);
      
      // Prepare document database record
      const isNewVersion = originalDocumentId && currentVersion > 0;
      
      const documentRecord = {
        document_name: documentName,
        document_type: documentType,
        category,
        file_path: filePath,
        file_url: publicUrl,
        file_size: file.size,
        file_type: file.type,
        entity_id: entityId,
        entity_type: entityType,
        version: isNewVersion ? currentVersion + 1 : 1,
        original_document_id: isNewVersion ? originalDocumentId : null,
        metadata: additionalData ? JSON.stringify(additionalData) : null,
      };

      // Save document record to database
      const { data, error } = await supabase
        .from('documents')
        .insert(documentRecord)
        .select('*')
        .single();
        
      if (error) {
        throw error;
      }
      
      return service.createResponse(true, data);
    } catch (error) {
      const service = new DocumentService();
      const errorResponse = service.handleError(error);
      service.showErrorToast(errorResponse);
      return service.createResponse(false, undefined, errorResponse);
    }
  }

  /**
   * Get documents for an entity
   */
  static async getDocuments(
    entityType: EntityType, 
    entityId: string
  ): Promise<ServiceResponse<Document[]>> {
    try {
      const service = new DocumentService();
      const supabase = service.getClient();
      
      const { data, error, status } = await supabase
        .from('documents')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return service.createResponse(true, data);
    } catch (error) {
      const service = new DocumentService();
      const errorResponse = service.handleError(error);
      return service.createResponse(false, undefined, errorResponse);
    }
  }

  /**
   * Delete a document
   */
  static async deleteDocument(documentId: string): Promise<ServiceResponse<void>> {
    try {
      const service = new DocumentService();
      const supabase = service.getClient();
      
      // First get the document to know the file path
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_path')
        .eq('id', documentId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Then delete from storage
      if (document?.file_path) {
        const { error: storageError } = await supabase
          .storage
          .from('documents')
          .remove([document.file_path]);
        
        if (storageError) {
          throw storageError;
        }
      }
      
      // Finally delete the record
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
      
      if (error) {
        throw error;
      }
      
      return service.createResponse(true);
    } catch (error) {
      const service = new DocumentService();
      const errorResponse = service.handleError(error);
      service.showErrorToast(errorResponse);
      return service.createResponse(false, undefined, errorResponse);
    }
  }

  /**
   * Get document versions
   */
  static async getDocumentVersions(
    documentId: string
  ): Promise<ServiceResponse<Document[]>> {
    try {
      const service = new DocumentService();
      const supabase = service.getClient();
      
      // Get the original document ID (either the document's original_document_id or its own ID if it's the original)
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('id, original_document_id')
        .eq('id', documentId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      const originalId = document?.original_document_id || document?.id;
      
      // Get all versions of this document (including the original)
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .or(`id.eq.${originalId},original_document_id.eq.${originalId}`)
        .order('version', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return service.createResponse(true, data);
    } catch (error) {
      const service = new DocumentService();
      const errorResponse = service.handleError(error);
      return service.createResponse(false, undefined, errorResponse);
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
      const service = new DocumentService();
      const supabase = service.getClient();
      
      // First get the document to determine the correct table
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('entity_type, id')
        .eq('id', documentId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      // Get current user for approval tracking
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Prepare update data
      const updateData = {
        approval_status: status,
        approval_notes: notes,
        approved_by: user.id,
        approved_at: new Date().toISOString()
      };
      
      // Update the document
      const { data, error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return service.createResponse(true, data);
    } catch (error) {
      const service = new DocumentService();
      const errorResponse = service.handleError(error);
      service.showErrorToast(errorResponse);
      return service.createResponse(false, undefined, errorResponse);
    }
  }
}
