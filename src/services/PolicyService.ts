
import { supabase } from "@/integrations/supabase/client";
import { Policy } from "@/types/policies";
import { BaseService, ServiceResponse } from "./BaseService";

// Define Policy Filter Parameters
export interface PolicyFilterParams {
  status?: string;
  workflow_status?: string;
  insurerId?: string;
  clientId?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
  searchTerm?: string;
}

// PolicyService class extends BaseService
class PolicyServiceClass extends BaseService {
  
  // Get all policies
  async getPolicies(): Promise<ServiceResponse<Policy[]>> {
    try {
      const { data, error } = await this.getClient()
        .from('policies')
        .select('*');
      
      if (error) throw error;
      
      return this.createResponse(true, data);
    } catch (error) {
      return this.createResponse(false, [], this.handleError(error));
    }
  }
  
  // Get policies with filters
  async getPoliciesWithFilters(filters: PolicyFilterParams): Promise<ServiceResponse<Policy[]>> {
    try {
      let query = this.getClient()
        .from('policies')
        .select('*');
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.workflow_status) {
        query = query.eq('workflow_status', filters.workflow_status);
      }
      
      if (filters.insurerId) {
        query = query.eq('insurer_id', filters.insurerId);
      }
      
      if (filters.clientId) {
        query = query.eq('client_id', filters.clientId);
      }
      
      if (filters.searchTerm) {
        query = query.or(`policy_number.ilike.%${filters.searchTerm}%,policyholder_name.ilike.%${filters.searchTerm}%`);
      }
      
      if (filters.dateRange?.from) {
        query = query.gte('start_date', filters.dateRange.from);
      }
      
      if (filters.dateRange?.to) {
        query = query.lte('expiry_date', filters.dateRange.to);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return this.createResponse(true, data);
    } catch (error) {
      return this.createResponse(false, [], this.handleError(error));
    }
  }
  
  // Get policy by ID
  async getPolicyById(id: string): Promise<ServiceResponse<Policy>> {
    try {
      const { data, error } = await this.getClient()
        .from('policies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return this.createResponse(true, data);
    } catch (error) {
      return this.createResponse(false, undefined, this.handleError(error));
    }
  }
  
  // Create policy
  async createPolicy(policy: Partial<Policy>): Promise<ServiceResponse<Policy>> {
    try {
      const { data, error } = await this.getClient()
        .from('policies')
        .insert({
          ...policy,
          company_id: this.getCompanyId(),
          created_by: this.getCurrentUserId()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return this.createResponse(true, data);
    } catch (error) {
      return this.createResponse(false, undefined, this.handleError(error));
    }
  }
  
  // Update policy
  async updatePolicy(id: string, updates: Partial<Policy>): Promise<ServiceResponse<Policy>> {
    try {
      const { data, error } = await this.getClient()
        .from('policies')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return this.createResponse(true, data);
    } catch (error) {
      return this.createResponse(false, undefined, this.handleError(error));
    }
  }
  
  // Update policy status - new method
  async updatePolicyStatus(id: string, status: string): Promise<ServiceResponse<Policy>> {
    try {
      const { data, error } = await this.getClient()
        .from('policies')
        .update({
          workflow_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return this.createResponse(true, data);
    } catch (error) {
      return this.createResponse(false, undefined, this.handleError(error));
    }
  }
}

// Export a singleton instance of the service
export const PolicyService = new PolicyServiceClass();
