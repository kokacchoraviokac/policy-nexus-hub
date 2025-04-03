
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Error response structure
 */
export interface ErrorResponse {
  status: number;
  message: string;
  details?: unknown;
}

/**
 * Base service response structure
 */
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  status?: number;
}

/**
 * Base abstract class for all API services
 * Provides common functionality and error handling
 */
export abstract class BaseService {
  /**
   * Get Supabase client
   */
  protected getClient() {
    return supabase;
  }

  /**
   * Standard error handler that normalizes error responses
   */
  protected handleError(error: any): ErrorResponse {
    console.error("API Error:", error);

    // Default error response
    const errorResponse: ErrorResponse = {
      status: 500,
      message: error?.message || "An unknown error occurred",
      details: error?.details || undefined
    };

    // Handle Supabase error
    if (error?.code) {
      switch (error.code) {
        case "PGRST301":
          errorResponse.status = 404;
          errorResponse.message = "Resource not found";
          break;
        case "42501":
          errorResponse.status = 403;
          errorResponse.message = "Permission denied";
          break;
        case "23505":
          errorResponse.status = 409; 
          errorResponse.message = "Duplicate record";
          break;
        default:
          errorResponse.status = 500;
          errorResponse.message = error.message || "Database error";
      }
    }

    return errorResponse;
  }

  /**
   * Create a standard response object
   */
  protected createResponse<T>(
    success: boolean, 
    data?: T, 
    error?: ErrorResponse,
    status?: number
  ): ServiceResponse<T> {
    return {
      success,
      data,
      error,
      status: status || (error ? error.status : 200)
    };
  }

  /**
   * Show toast notification for error
   */
  protected showErrorToast(error: ErrorResponse) {
    toast.error(error.message || "An error occurred");
  }
}
