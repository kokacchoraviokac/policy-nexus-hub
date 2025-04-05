
/**
 * Safely extracts an error message from various error types
 * @param error The error object
 * @returns A string error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unknown error occurred';
}

/**
 * Helper to handle errors from API responses
 * @param error The error from an API response
 * @returns A formatted error message
 */
export function handleApiErrorMessage(error: string | Record<string, any> | Error): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  if (error && typeof error === 'object') {
    return JSON.stringify(error);
  }
  
  return 'An unknown error occurred';
}

/**
 * Handle Supabase error and extract readable message
 * @param error Error from Supabase operation
 * @returns A user-friendly error message
 */
export function handleSupabaseError(error: any): string {
  if (!error) return 'Unknown error';
  
  // Handle PostgreSQL errors
  if (error.code && error.code.startsWith('P')) {
    switch (error.code) {
      case 'P0001': return 'Database constraint violation';
      case 'P0002': return 'No data found';
      case 'P0003': return 'Too many rows returned';
      case 'P0004': return 'Query too complex';
      default: return `Database error: ${error.message || error.code}`;
    }
  }
  
  // Handle auth errors
  if (error.code && error.code.startsWith('auth')) {
    switch (error.code) {
      case 'auth/invalid-email': return 'The email address is invalid';
      case 'auth/user-disabled': return 'This user account has been disabled';
      case 'auth/user-not-found': return 'No user found with this email';
      case 'auth/wrong-password': return 'Incorrect password';
      default: return `Authentication error: ${error.message || error.code}`;
    }
  }
  
  // Handle other errors
  return error.message || 'An error occurred while communicating with the server';
}
