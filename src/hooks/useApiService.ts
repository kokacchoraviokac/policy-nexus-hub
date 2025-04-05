
import { useState } from 'react';

type ApiError = string | Record<string, any>;

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
  
  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    handleApiError
  };
};
