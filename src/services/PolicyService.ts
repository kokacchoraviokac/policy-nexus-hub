
import { BaseService, ServiceResponse } from "./BaseService";
import { Policy } from "@/types/policies";
import { PolicyWorkflowStatus } from "@/utils/policyWorkflowUtils";

/**
 * Service for policy management
 */
export class PolicyService extends BaseService {
  /**
   * Get policy by ID
   */
  static async getPolicy(id: string): Promise<ServiceResponse<Policy>> {
    try {
      const service = new PolicyService();
      const supabase = service.getClient();
      
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return service.createResponse(true, data);
    } catch (error) {
      const service = new PolicyService();
      const errorResponse = service.handleError(error);
      return service.createResponse(false, undefined, errorResponse);
    }
  }
  
  /**
   * Get policies filtered by provided parameters
   */
  static async getPolicies(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    workflowStatus?: PolicyWorkflowStatus;
    startDate?: string;
    endDate?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }): Promise<ServiceResponse<{ policies: Policy[]; totalCount: number }>> {
    try {
      const service = new PolicyService();
      const supabase = service.getClient();
      
      const {
        page = 1,
        pageSize = 10,
        search,
        status,
        workflowStatus,
        startDate,
        endDate,
        orderBy = 'created_at',
        orderDirection = 'desc'
      } = params;
      
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      let query = supabase
        .from('policies')
        .select('*', { count: 'exact' });
      
      if (search) {
        query = query.or(
          `policy_number.ilike.%${search}%,` +
          `policyholder_name.ilike.%${search}%,` +
          `insurer_name.ilike.%${search}%,` +
          `product_name.ilike.%${search}%`
        );
      }
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      if (workflowStatus && workflowStatus !== 'all') {
        query = query.eq('workflow_status', workflowStatus);
      }
      
      if (startDate) {
        query = query.gte('start_date', startDate);
      }
      
      if (endDate) {
        query = query.lte('expiry_date', endDate);
      }
      
      // Handle pagination
      query = query
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) {
        throw error;
      }
      
      return service.createResponse(true, {
        policies: data || [],
        totalCount: count || 0
      });
    } catch (error) {
      const service = new PolicyService();
      const errorResponse = service.handleError(error);
      return service.createResponse(false, undefined, errorResponse);
    }
  }
  
  /**
   * Update policy workflow status
   */
  static async updatePolicyStatus(
    id: string, 
    status: PolicyWorkflowStatus
  ): Promise<ServiceResponse<Policy>> {
    try {
      const service = new PolicyService();
      const supabase = service.getClient();
      
      const { data, error } = await supabase
        .from('policies')
        .update({ 
          workflow_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      return service.createResponse(true, data);
    } catch (error) {
      const service = new PolicyService();
      const errorResponse = service.handleError(error);
      service.showErrorToast(errorResponse);
      return service.createResponse(false, undefined, errorResponse);
    }
  }
  
  /**
   * Update policy details
   */
  static async updatePolicy(
    id: string, 
    policyData: Partial<Policy>
  ): Promise<ServiceResponse<Policy>> {
    try {
      const service = new PolicyService();
      const supabase = service.getClient();
      
      // Make sure to update the updated_at field
      const dataToUpdate = {
        ...policyData,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('policies')
        .update(dataToUpdate)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      return service.createResponse(true, data);
    } catch (error) {
      const service = new PolicyService();
      const errorResponse = service.handleError(error);
      service.showErrorToast(errorResponse);
      return service.createResponse(false, undefined, errorResponse);
    }
  }
}
