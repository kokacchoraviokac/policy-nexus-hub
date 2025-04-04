
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string | ErrorResponse;
  status?: number;
}

export interface ErrorResponse {
  code?: string;
  message: string;
  details?: any;
}

export class BaseService {
  static getClient() {
    return supabase;
  }

  static createResponse<T>(success: boolean, data?: T, error?: string | ErrorResponse, status?: number): ServiceResponse<T> {
    return { success, data, error, status };
  }

  static handleError(error: any): string | ErrorResponse {
    console.error("Service error:", error);

    if (typeof error === "string") {
      return error;
    }

    // Handle Supabase errors
    if (error?.code && error?.message) {
      return {
        code: error.code,
        message: error.message,
        details: error.details || error.hint
      };
    }

    // Handle generic Error objects
    if (error instanceof Error) {
      return error.message;
    }

    // Fallback
    return "An unexpected error occurred";
  }

  static showErrorToast(error: string | ErrorResponse) {
    const errorMessage = typeof error === "string" 
      ? error 
      : error.message || "An unexpected error occurred";

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  }

  static showSuccessToast(message: string) {
    toast({
      title: "Success",
      description: message,
    });
  }
}
