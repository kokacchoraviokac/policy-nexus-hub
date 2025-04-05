
/**
 * Extract message from various error types (string, Error, Record<string, any>)
 */
export function getErrorMessage(error: unknown): string {
  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle strings
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle objects with message property
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  // Handle Response objects
  if (error && typeof error === 'object' && 'statusText' in error) {
    return String(error.statusText);
  }
  
  // Handle Supabase errors
  if (error && typeof error === 'object' && 'error' in error && typeof error.error === 'object' && error.error && 'message' in error.error) {
    return String(error.error.message);
  }
  
  // Default fallback
  return 'An unknown error occurred';
}

/**
 * Safely handle errors from async/await functions
 */
export async function handleAsyncError<T>(
  promise: Promise<T>, 
  errorHandler?: (error: unknown) => void
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      console.error('Unhandled error:', error);
    }
    return [null, error instanceof Error ? error : new Error(getErrorMessage(error))];
  }
}
