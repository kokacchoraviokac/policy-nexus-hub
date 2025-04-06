
// Basic types that can be shared across the application

// Entity types for documents and other related functionalities
export type EntityType = 
  | 'policy'
  | 'claim'
  | 'client'
  | 'insurer'
  | 'sales_process'
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
