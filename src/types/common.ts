
// Define general entity types for documents
export type EntityType = 
  | "policy"
  | "claim"
  | "sales_process"
  | "client"
  | "insurer"
  | "agent"
  | "addendum"
  | "invoice";

// Document categories
export type DocumentCategory = 
  | "contract"
  | "invoice"
  | "report"
  | "policy"
  | "claim"
  | "notification"
  | "correspondence"
  | "other"
  | "lien"
  | "discovery"
  | "quote"
  | "proposal"
  | "closeout";

// Standard response structure for service operations
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | Error;
  message?: string;
}

// Status constants for various modules
export enum CommonStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

// Badge variant types for consistency
export type BadgeVariant = 
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "info";
