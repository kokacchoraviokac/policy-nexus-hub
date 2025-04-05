
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ErrorResponse {
  message: string;
  details?: any;
}

export interface ServiceOptions {
  successMessage?: string;
  errorMessage?: string;
  invalidateQueryKeys?: any[][];
}

export const useApiService = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleApiError = useCallback((error: string | Record<string, any>) => {
    let errorMessage: string;
    
    if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = error.message as string;
    } else {
      errorMessage = t("unknownError");
    }
    
    setError(new Error(errorMessage));
    
    toast({
      title: t("error"),
      description: errorMessage,
      variant: "destructive"
    });
    
    return new Error(errorMessage);
  }, [t, toast]);

  const executeService = useCallback(async <T>(
    serviceCall: () => Promise<T>,
    options?: ServiceOptions
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await serviceCall();
      
      if (options?.successMessage) {
        toast({
          title: t("success"),
          description: options.successMessage
        });
      }
      
      return result;
    } catch (err) {
      const errMessage = typeof err === 'object' && err !== null && 'message' in err 
        ? (err as Error).message 
        : options?.errorMessage || t("operationFailed");
      
      handleApiError(errMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError, t, toast]);

  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    handleApiError,
    executeService
  };
};
