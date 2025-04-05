
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string | Record<string, any>;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  details?: any;
}

export class BaseService {
  protected static getClient() {
    return supabase;
  }

  protected getClient() {
    return supabase;
  }

  protected static createResponse<T>(
    success: boolean,
    data?: T,
    error?: string | Record<string, any>,
    message?: string
  ): ServiceResponse<T> {
    return {
      success,
      data,
      error,
      message,
    };
  }

  protected createResponse<T>(
    success: boolean,
    data?: T,
    error?: string | Record<string, any>,
    message?: string
  ): ServiceResponse<T> {
    return {
      success,
      data,
      error,
      message,
    };
  }

  protected static handleError(error: any): string | Record<string, any> {
    console.error("Service error:", error);
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return error?.error || "An unknown error occurred";
  }

  protected handleError(error: any): string | Record<string, any> {
    console.error("Service error:", error);
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return error?.error || "An unknown error occurred";
  }

  protected showErrorToast(errorMessage: string | Record<string, any>) {
    const message = typeof errorMessage === 'string' 
      ? errorMessage 
      : errorMessage.message || "An error occurred";
      
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }
}
