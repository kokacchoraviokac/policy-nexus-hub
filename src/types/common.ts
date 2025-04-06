
// Entity types used throughout the application
export type EntityType = 
  | 'policy' 
  | 'claim' 
  | 'client' 
  | 'invoice' 
  | 'addendum' 
  | 'sales_process' 
  | 'sale' 
  | 'agent' 
  | 'insurer';

// Document categories
export type DocumentCategory = 
  | 'policy' 
  | 'claim' 
  | 'client' 
  | 'invoice' 
  | 'other' 
  | 'claim_evidence' 
  | 'medical' 
  | 'legal' 
  | 'financial' 
  | 'lien' 
  | 'notification' 
  | 'correspondence' 
  | 'discovery' 
  | 'quote' 
  | 'proposal' 
  | 'contract' 
  | 'closeout';

// Generic pagination interface
export interface PaginationData {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Generic filters interface
export interface FilterOptions {
  [key: string]: any;
}

// Generic sort options
export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// Generic response format for API calls
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Generic list response with pagination
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationData;
}
