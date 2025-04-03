import { BaseService, ServiceResponse } from "./BaseService";
import { Policy, PolicyFilterParams } from "@/types/policies";

export class PolicyService extends BaseService {
  /**
   * Get a paginated list of policies with optional filtering
   */
  static async getPolicies(params: PolicyFilterParams): Promise<ServiceResponse<{ policies: Policy[], totalCount: number }>> {
    try {
      const { page = 1, pageSize = 10, search = '', orderBy = 'created_at', orderDirection = 'desc', workflowStatus } = params;
      
      // Calculate offset
      const offset = (page - 1) * pageSize;
      
      // Build query
      let query = this.getClient()
        .from('policies')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (search) {
        query = query.or(`policy_number.ilike.%${search}%,policyholder_name.ilike.%${search}%,insurer_name.ilike.%${search}%`);
      }
      
      if (workflowStatus) {
        query = query.eq('workflow_status', workflowStatus);
      }
      
      // Apply sorting and pagination
      const { data, error, count } = await query
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range(offset, offset + pageSize - 1);
        
      if (error) {
        throw error;
      }
      
      return this.createResponse(true, { 
        policies: data as Policy[], 
        totalCount: count || 0 
      });
    } catch (error) {
      const errorResponse = this.handleError(error);
      return this.createResponse(false, undefined, errorResponse);
    }
  }
  
  /**
   * Get a single policy by ID
   */
  static async getPolicy(id: string): Promise<ServiceResponse<Policy>> {
    try {
      const { data, error } = await this.getClient()
        .from('policies')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return this.createResponse(true, data as Policy);
    } catch (error) {
      const errorResponse = this.handleError(error);
      return this.createResponse(false, undefined, errorResponse);
    }
  }

  /**
   * Update policy workflow status
   */
  static async updatePolicyStatus(id: string, status: 'draft' | 'in_review' | 'ready' | 'complete'): Promise<ServiceResponse<Policy>> {
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
        
      if (error) {
        throw error;
      }
      
      return this.createResponse(true, data as Policy);
    } catch (error) {
      const errorResponse = this.handleError(error);
      return this.createResponse(false, undefined, errorResponse);
    }
  }

  /**
   * Create a new policy
   */
  static async createPolicy(policy: Policy): Promise<ServiceResponse<Policy>> {
    try {
      const { data, error } = await this.getClient()
        .from('policies')
        .insert([policy])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this.createResponse(true, data as Policy);
    } catch (error) {
      const errorResponse = this.handleError(error);
      return this.createResponse(false, undefined, errorResponse);
    }
  }

  /**
   * Update an existing policy
   */
  static async updatePolicy(id: string, updates: Partial<Policy>): Promise<ServiceResponse<Policy>> {
    try {
      const { data, error } = await this.getClient()
        .from('policies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this.createResponse(true, data as Policy);
    } catch (error) {
      const errorResponse = this.handleError(error);
      return this.createResponse(false, undefined, errorResponse);
    }
  }

  /**
   * Delete a policy by ID
   */
  static async deletePolicy(id: string): Promise<ServiceResponse<null>> {
    try {
      const { error } = await this.getClient()
        .from('policies')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return this.createResponse(true, null);
    } catch (error) {
      const errorResponse = this.handleError(error);
      return this.createResponse(false, undefined, errorResponse);
    }
  }
}
