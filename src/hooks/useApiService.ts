
import { useState } from "react";
import { useQueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from 'sonner';
import { useLanguage } from "@/contexts/LanguageContext";

interface ApiServiceOptions {
  successMessage?: string;
  errorMessage?: string;
  invalidateQueryKeys?: QueryKey[];
}

export const useApiService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  const executeService = async <T>(
    serviceCall: () => Promise<{success: boolean; data?: T; error?: string | Record<string, any>}>,
    options: ApiServiceOptions = {}
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      
      const { success, data, error } = await serviceCall();
      
      if (!success || error) {
        // Handle the error
        const errorMessage = typeof error === 'string' 
          ? error 
          : error && typeof error === 'object' && 'message' in error 
            ? String(error.message) 
            : options.errorMessage || t("errorOccurred");
            
        toast.error(errorMessage);
        return null;
      }
      
      // Handle success
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      
      // Invalidate queries if specified
      if (options.invalidateQueryKeys && options.invalidateQueryKeys.length > 0) {
        for (const queryKey of options.invalidateQueryKeys) {
          queryClient.invalidateQueries({ queryKey: queryKey });
        }
      }
      
      return data || null;
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = error instanceof Error ? error.message : options.errorMessage || t("errorOccurred");
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    executeService
  };
};
