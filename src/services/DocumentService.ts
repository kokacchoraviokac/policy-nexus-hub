
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Document, DocumentCategory, EntityType } from "@/types/documents";
import { getDocumentTableName } from "@/utils/documentUploadUtils";

class DocumentService {
  /**
   * Upload a document to storage and create a document record
   */
  async uploadDocument({
    file,
    documentName,
    documentType,
    category,
    entityId,
    entityType,
    originalDocumentId,
    currentVersion = 0,
    step
  }: {
    file: File;
    documentName: string;
    documentType: string;
    category: string;
    entityId: string;
    entityType: EntityType;
    originalDocumentId?: string | null;
    currentVersion?: number;
    step?: string;
  }) {
    try {
      // Get user for uploading
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `documents/${entityType}/${entityId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        throw uploadError;
      }

      // Determine table name based on entity type
      const tableName = getDocumentTableName(entityType);

      // Calculate new version if it's a version update
      const version = currentVersion > 0 ? currentVersion + 1 : 1;

      // Create document record in database
      let documentData: any = {
        document_name: documentName,
        document_type: documentType,
        file_path: filePath,
        uploaded_by: user.id,
        company_id: user?.user_metadata?.company_id,
        category: category || "other",
        version: version,
        is_latest_version: true,
        mime_type: file.type,
        original_document_id: originalDocumentId || null
      };

      // Set the appropriate entity ID field based on the table
      if (tableName === "policy_documents") {
        documentData.policy_id = entityId;
      } else if (tableName === "claim_documents") {
        documentData.claim_id = entityId;
      } else if (tableName === "sales_documents") {
        documentData.sales_process_id = entityId;
        // Add sales-specific fields
        if (step) {
          documentData.step = step;
        }
      }

      // Insert the document record using the resolved table name
      const { data, error: dbError } = await supabase
        .from(tableName)
        .insert(documentData)
        .select()
        .single();

      if (dbError) {
        console.error("Error creating document record:", dbError);
        
        // Try to clean up the uploaded file on db error
        await supabase.storage
          .from('documents')
          .remove([filePath]);
          
        throw dbError;
      }

      // If this is a new version, update previous version
      if (originalDocumentId) {
        await supabase
          .from(tableName)
          .update({ is_latest_version: false })
          .eq('id', originalDocumentId);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Document upload failed:", error);
      return { success: false, error };
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string, tableName: string) {
    try {
      // First get the document to get the file path
      const { data: document } = await supabase
        .from(tableName)
        .select('file_path')
        .eq('id', documentId)
        .single();
      
      if (document?.file_path) {
        // Delete the file from storage
        await supabase.storage
          .from('documents')
          .remove([document.file_path]);
      }
      
      // Delete the document record
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", documentId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error deleting document:", error);
      return { success: false, error };
    }
  }

  /**
   * Download a document
   */
  async downloadDocument(document: Document) {
    try {
      const bucket = 'documents';
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(document.file_path);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.document_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      return { success: true };
    } catch (error) {
      console.error("Download error:", error);
      return { success: false, error };
    }
  }

  /**
   * Fetch documents
   */
  async fetchDocuments(entityType: EntityType, entityId: string): Promise<Document[]> {
    try {
      const tableName = getDocumentTableName(entityType);
      let query;
      
      if (tableName === "policy_documents") {
        query = supabase
          .from(tableName)
          .select("*")
          .eq("policy_id", entityId);
      } else if (tableName === "claim_documents") {
        query = supabase
          .from(tableName)
          .select("*")
          .eq("claim_id", entityId);
      } else if (tableName === "sales_documents") {
        query = supabase
          .from(tableName)
          .select("*")
          .eq("sales_process_id", entityId);
      } else {
        throw new Error(`Unsupported document table: ${tableName}`);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      // Map the data to our Document type
      return (data || []).map((item: any) => {
        let mappedEntityId = "";
        
        if (tableName === "policy_documents") {
          mappedEntityId = item.policy_id;
        } else if (tableName === "claim_documents") {
          mappedEntityId = item.claim_id;
        } else if (tableName === "sales_documents") {
          mappedEntityId = item.sales_process_id;
        }
        
        return {
          id: item.id,
          document_name: item.document_name,
          document_type: item.document_type,
          created_at: item.created_at,
          file_path: item.file_path,
          entity_type: entityType,
          entity_id: mappedEntityId,
          uploaded_by_id: item.uploaded_by,
          uploaded_by_name: "", // We'll populate this if needed
          description: item.description || "",
          version: item.version || 1,
          status: item.status || "active",
          tags: item.tags || [],
          category: item.category || "other",
          mime_type: item.mime_type || "",
          is_latest_version: item.is_latest_version || true,
          original_document_id: item.original_document_id || null,
          approval_status: item.approval_status || "pending"
        } as Document;
      });
    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  }
}

export const documentService = new DocumentService();
