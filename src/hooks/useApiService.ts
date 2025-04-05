
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ErrorResponse {
  message: string;
  details?: any;
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

  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    handleApiError
  };
};
