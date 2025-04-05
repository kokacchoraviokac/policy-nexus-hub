
import { useState } from 'react';

export type ApiError = string | Record<string, any>;

interface ServiceOptions {
  successMessage?: string;
  errorMessage?: string;
  invalidateQueryKeys?: string[][];
}

export const useApiService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const handleApiError = (error: ApiError): Error => {
    console.error("API Error:", error);
    
    if (typeof error === 'string') {
      return new Error(error);
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      return new Error(error.message as string);
    }
    
    return new Error('An unexpected error occurred');
  };
  
  // Add a new executeService method for better service handling
  const executeService = async <T extends any>(
    serviceCall: () => Promise<{ success: boolean; data?: T; error?: Error | string | Record<string, any> }>,
    options?: ServiceOptions
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await serviceCall();
      
      if (!result.success) {
        throw result.error || new Error('Service call failed');
      }
      
      if (options?.successMessage) {
        // You could add toast notification here
        console.log(options.successMessage);
      }
      
      return result.data || null;
    } catch (err) {
      const apiError = err as ApiError;
      const formattedError = handleApiError(apiError);
      setError(formattedError);
      
      if (options?.errorMessage) {
        // You could add toast notification here
        console.error(options.errorMessage);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    handleApiError,
    executeService
  };
};
