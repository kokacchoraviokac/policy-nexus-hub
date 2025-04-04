
import { Policy } from "@/types/policies";
import { BaseService } from "./BaseService";

export interface PolicyFilterParams {
  status?: string;
  clientId?: string;
  insurerId?: string;
  query?: string;
  startDate?: string;
  endDate?: string;
  policyType?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export class PolicyService extends BaseService {
  /**
   * Create a new policy
   */
  static async createPolicy(policyData: Partial<Policy>): Promise<Policy> {
    try {
      const service = new PolicyService();
      const supabase = service.getClient();
      
      const { data, error } = await supabase
        .from('policies')
        .insert({ 
          ...policyData,
          company_id: service.getCompanyId(),
          created_by: service.getCurrentUserId(),
        })
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error creating policy: ${errorMessage}`);
    }
  }
  
  /**
   * Get a policy by ID
   */
  static async getPolicy(policyId: string): Promise<Policy> {
    try {
      const service = new PolicyService();
      const supabase = service.getClient();
      
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error retrieving policy: ${errorMessage}`);
    }
  }
  
  /**
   * Update a policy
   */
  static async updatePolicy(policyId: string, policyData: Partial<Policy>): Promise<Policy> {
    try {
      const service = new PolicyService();
      const supabase = service.getClient();
      
      const { data, error } = await supabase
        .from('policies')
        .update({
          ...policyData,
          updated_at: new Date().toISOString()
        })
        .eq('id', policyId)
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error updating policy: ${errorMessage}`);
    }
  }
  
  /**
   * Delete a policy
   */
  static async deletePolicy(policyId: string): Promise<void> {
    try {
      const service = new PolicyService();
      const supabase = service.getClient();
      
      const { error } = await supabase
        .from('policies')
        .delete()
        .eq('id', policyId);
      
      if (error) throw error;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error deleting policy: ${errorMessage}`);
    }
  }
  
  /**
   * Get policies with optional filtering
   */
  static async getPolicies(filters?: PolicyFilterParams): Promise<Policy[]> {
    try {
      const service = new PolicyService();
      const supabase = service.getClient();
      
      let query = supabase
        .from('policies')
        .select('*')
        .eq('company_id', service.getCompanyId());
      
      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.clientId) {
        query = query.eq('client_id', filters.clientId);
      }
      
      if (filters?.insurerId) {
        query = query.eq('insurer_id', filters.insurerId);
      }
      
      if (filters?.policyType) {
        query = query.eq('policy_type', filters.policyType);
      }
      
      if (filters?.query) {
        query = query.or(`policy_number.ilike.%${filters.query}%,policyholder_name.ilike.%${filters.query}%`);
      }
      
      if (filters?.startDate) {
        query = query.gte('start_date', filters.startDate);
      }
      
      if (filters?.endDate) {
        query = query.lte('expiry_date', filters.endDate);
      }
      
      // Sort
      if (filters?.sortBy) {
        query = query.order(filters.sortBy, { 
          ascending: filters.sortDirection !== 'desc'
        });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      // Pagination
      if (filters?.page && filters?.pageSize) {
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Error retrieving policies: ${errorMessage}`);
    }
  }
}
