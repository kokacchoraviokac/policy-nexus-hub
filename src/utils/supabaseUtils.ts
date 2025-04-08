
import { ServiceResponse } from "@/types/common";

/**
 * Safely handle Supabase response
 * @param action Function that makes a Supabase request
 * @returns ServiceResponse with data or error
 */
export async function handleSupabaseRequest<T>(
  action: () => Promise<{ data: T; error: any }>
): Promise<ServiceResponse<T>> {
  try {
    const { data, error } = await action();
    
    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        data: null,
        error: new Error(error.message || 'An error occurred')
      };
    }
    
    return {
      success: true,
      data,
      error: null
    };
  } catch (err) {
    console.error('Error in Supabase request:', err);
    
    const error = err instanceof Error ? err : new Error('An unknown error occurred');
    
    return {
      success: false,
      data: null,
      error
    };
  }
}

/**
 * Format Supabase error for user-friendly display
 * @param error Supabase error object
 * @returns Formatted error message
 */
export function formatSupabaseError(error: any): string {
  if (!error) {
    return 'An unknown error occurred';
  }
  
  // If the error is a string, just return it
  if (typeof error === 'string') {
    return error;
  }
  
  // If the error has a message property, return that
  if (error.message) {
    return error.message;
  }
  
  // If the error has details, return those
  if (error.details) {
    return typeof error.details === 'string' 
      ? error.details 
      : JSON.stringify(error.details);
  }
  
  // Default error message
  return 'An error occurred while processing your request';
}
