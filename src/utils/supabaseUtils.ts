
import { DocumentTableName } from "@/utils/documentUploadUtils";
import { EntityType, Document } from "@/types/documents";
import { ServiceResponse } from "@/types/services";

/**
 * Safe type assertion for dealing with Supabase polymorphic return types
 * 
 * @param data The data returned from Supabase
 * @returns The data cast to the specified type
 */
export function safeDataCast<T>(data: any): T {
  return data as T;
}

/**
 * Helper function to safely execute a Supabase query that returns a document
 * 
 * @param tableName The table name to query
 * @param query The query function to execute
 * @returns A promise with the service response
 */
export async function executeDocumentQuery<T>(
  entityType: EntityType,
  query: (tableName: string) => Promise<{ data: any; error: any }>
): Promise<ServiceResponse<T>> {
  try {
    let tableName: string;
    
    // Map entity type to table name
    switch (entityType) {
      case 'policy':
        tableName = 'policy_documents';
        break;
      case 'claim':
        tableName = 'claim_documents';
        break;
      case 'sales_process':
        tableName = 'sales_documents';
        break;
      case 'client':
        tableName = 'client_documents';
        break;
      case 'insurer':
        tableName = 'insurer_documents';
        break;
      case 'agent':
        tableName = 'agent_documents';
        break;
      case 'invoice':
        tableName = 'invoice_documents';
        break;
      case 'addendum':
        tableName = 'addendum_documents';
        break;
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
    
    const { data, error } = await query(tableName);
    
    if (error) throw error;
    
    return { success: true, data: safeDataCast<T>(data) };
  } catch (error) {
    console.error(`Error executing document query for ${entityType}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error("Failed to execute document query") 
    };
  }
}

/**
 * Helper function to get the entity ID column name based on entity type
 */
export function getEntityIdColumn(entityType: EntityType): string {
  switch (entityType) {
    case 'policy':
      return 'policy_id';
    case 'claim':
      return 'claim_id';
    case 'sales_process':
      return 'sales_process_id';
    case 'client':
      return 'client_id';
    case 'insurer':
      return 'insurer_id';
    case 'agent':
      return 'agent_id';
    case 'invoice':
      return 'invoice_id';
    case 'addendum':
      return 'addendum_id';
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
}
