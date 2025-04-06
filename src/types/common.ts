
/**
 * Common types shared across multiple modules
 */

/**
 * Represents the type of entity in the system
 */
export type EntityType = 
  | 'policy'
  | 'claim'
  | 'sale'
  | 'client'
  | 'insurer'
  | 'agent'
  | 'invoice'
  | 'addendum'
  | 'sales_process';

/**
 * Utility type for pagination results
 */
export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * Basic service response interface
 */
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
  message?: string;
}
