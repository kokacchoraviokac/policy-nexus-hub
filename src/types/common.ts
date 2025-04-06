
// Basic types that can be shared across the application

// Entity types for documents and other related functionalities
export type EntityType = 
  | 'policy'
  | 'claim'
  | 'client'
  | 'insurer'
  | 'sales_process'
  | 'sale' // Added this alias
  | 'agent'
  | 'invoice'
  | 'addendum';

// Document categories
export type DocumentCategory = 
  | 'policy'
  | 'claim'
  | 'client'
  | 'invoice'
  | 'proposal'
  | 'quote'
  | 'identification'
  | 'other';

// Service response type for API calls
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: Error | string;
}
