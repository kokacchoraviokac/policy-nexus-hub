
// Common type definitions shared across the application

export type EntityType = 
  | 'policy' 
  | 'claim' 
  | 'sales_process' 
  | 'sale' // Alias for backward compatibility 
  | 'client' 
  | 'insurer' 
  | 'agent' 
  | 'invoice' 
  | 'addendum';

// Additional common types
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Add any other shared common types here
