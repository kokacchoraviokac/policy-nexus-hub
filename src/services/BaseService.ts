
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | Record<string, any>;
}

export class BaseService {
  protected supabaseClient;
  
  constructor() {
    this.supabaseClient = createClient(
      import.meta.env.VITE_SUPABASE_URL || '',
      import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    );
  }
  
  getClient() {
    return this.supabaseClient;
  }
  
  getCompanyId() {
    // This should ideally come from a context or state
    // For now, return a default or fetch from local storage
    return localStorage.getItem('companyId') || 'default-company-id';
  }
  
  getCurrentUserId() {
    // This should ideally come from auth context
    return localStorage.getItem('currentUserId') || 'default-user-id';
  }
  
  createResponse<T>(success: boolean, data?: T, error?: string | Record<string, any>): ServiceResponse<T> {
    return {
      success,
      data,
      error
    };
  }
  
  handleError(error: any): string {
    console.error("Service error:", error);
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return "An unknown error occurred";
  }
  
  showErrorToast(errorMessage: string) {
    const { toast } = useToast();
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  }
}
