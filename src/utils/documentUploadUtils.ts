
import { supabase } from "@/integrations/supabase/client";
import { DocumentTableName, DocumentUploadOptions } from "@/types/documents";
import { EntityType } from "@/types/common";

/**
 * Get the document table name based on entity type
 * @param entityType The type of entity
 * @returns The document table name
 */
export const getDocumentTableName = (entityType: EntityType): DocumentTableName => {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policy_documents';
    case EntityType.CLAIM:
      return 'claim_documents';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return 'sales_documents';
    case EntityType.CLIENT:
      return 'client_documents';
    case EntityType.INSURER:
      return 'insurer_documents';
    case EntityType.AGENT:
      return 'agent_documents';
    case EntityType.ADDENDUM:
      return 'addendum_documents';
    case EntityType.INVOICE:
      return 'invoice_documents';
    default:
      console.warn(`No document table found for entity type: ${entityType}. Defaulting to policy_documents.`);
      return 'policy_documents';
  }
};

/**
 * Get the entity ID column name based on entity type
 * @param entityType The type of entity
 * @returns The entity ID column name
 */
export const getEntityIdColumn = (entityType: EntityType): string => {
  switch (entityType) {
    case EntityType.POLICY:
      return 'policy_id';
    case EntityType.CLAIM:
      return 'claim_id';
    case EntityType.SALES_PROCESS:
    case EntityType.SALE:
      return 'sales_process_id';
    case EntityType.CLIENT:
      return 'client_id';
    case EntityType.INSURER:
      return 'insurer_id';
    case EntityType.AGENT:
      return 'agent_id';
    case EntityType.ADDENDUM:
      return 'addendum_id';
    case EntityType.INVOICE:
      return 'invoice_id';
    default:
      console.warn(`No entity ID column found for entity type: ${entityType}. Defaulting to policy_id.`);
      return 'policy_id';
  }
};

/**
 * Convert a DocumentTableName to a Supabase table name for type safety
 */
export const asTableName = (tableName: DocumentTableName): string => {
  return tableName;
};

/**
 * Upload a document to storage and create a record in the database
 */
export const uploadDocument = async (options: DocumentUploadOptions): Promise<{ success: boolean; documentId?: string; error?: string }> => {
  const { file, documentName, documentType, category, entityId, entityType } = options;

  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${entityType}/${entityId}/${fileName}`;

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get the document table name based on entity type
    const tableName = getDocumentTableName(entityType);

    // Create the document record
    const documentData: any = {
      document_name: documentName,
      document_type: documentType,
      file_path: filePath,
      entity_id: entityId,
      entity_type: entityType,
      uploaded_by: options.uploadedBy || null,
      company_id: options.companyId || null,
      category,
    };

    // Add entity-specific ID field
    const entityIdColumn = getEntityIdColumn(entityType);
    documentData[entityIdColumn] = entityId;

    // Add version info if this is an update
    if (options.originalDocumentId) {
      documentData.original_document_id = options.originalDocumentId;
      documentData.version = (options.currentVersion || 0) + 1;
      documentData.is_latest_version = true;
    }

    // Insert document record
    const { data: docData, error: docError } = await supabase
      .from(tableName)
      .insert(documentData)
      .select()
      .single();

    if (docError) {
      throw docError;
    }

    // If this is a new version, update the previous version
    if (options.originalDocumentId) {
      await supabase
        .from(tableName)
        .update({ is_latest_version: false })
        .eq('id', options.originalDocumentId);
    }

    return { success: true, documentId: docData.id };
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return { success: false, error: error.message || 'Failed to upload document' };
  }
};
