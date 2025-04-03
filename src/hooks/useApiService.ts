
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ServiceResponse } from "@/services/BaseService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Generic hook for handling API service calls with loading states and error handling
 */
export function useApiService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  /**
   * Execute a service call and handle loading/error states
   */
  const executeService = async <T>(
    serviceCall: () => Promise<ServiceResponse<T>>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      invalidateQueryKeys?: string[][];
    }
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await serviceCall();

      if (!response.success) {
        throw response.error?.message || t("unknownError");
      }

      if (options?.successMessage) {
        toast.success(options.successMessage);
      }

      // Invalidate queries if specified
      if (options?.invalidateQueryKeys) {
        for (const queryKey of options.invalidateQueryKeys) {
          queryClient.invalidateQueries({ queryKey });
        }
      }

      return response.data || null;
    } catch (err: any) {
      const errorMessage = options?.errorMessage || err?.message || t("unknownError");
      setError(errorMessage);

      // Toast the error message unless explicitly disabled
      toast.error(errorMessage);
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    executeService
  };
}
