
import { Policy } from "@/types/policies";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ServiceResponse } from "@/types/services";

const getClient = () => {
  return supabase;
};

const handleError = (error: any): string => {
  if (typeof error === 'string') return error;
  return error.message || "An unknown error occurred";
};

const createResponse = <T>(success: boolean, data?: T, error?: any): ServiceResponse<T> => {
  return {
    success,
    data: data || null,
    error: error ? handleError(error) : null
  };
};

export const PolicyService = {
  getClient,
  handleError,
  createResponse,
  
  async getPolicies(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    workflowStatus?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }) {
    try {
      const client = getClient();
      let query = client.from('policies').select('*', { count: 'exact' });
      
      // Apply filters
      if (params.status) {
        query = query.eq('status', params.status);
      }
      
      if (params.workflowStatus) {
        query = query.eq('workflow_status', params.workflowStatus);
      }
      
      if (params.search) {
        query = query.or(`policy_number.ilike.%${params.search}%,policyholder_name.ilike.%${params.search}%,insurer_name.ilike.%${params.search}%`);
      }
      
      // Apply sorting
      const orderBy = params.orderBy || 'created_at';
      const orderDirection = params.orderDirection || 'desc';
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      
      // Apply pagination
      if (params.page !== undefined && params.pageSize !== undefined) {
        const from = params.page * params.pageSize;
        const to = from + params.pageSize - 1;
        query = query.range(from, to);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return createResponse({
        policies: data,
        totalCount: count || 0
      });
    } catch (error) {
      console.error("Error fetching policies:", error);
      return createResponse(false, null, error);
    }
  },
  
  async getPolicy(policyId: string) {
    try {
      const client = getClient();
      const { data, error } = await client
        .from('policies')
        .select('*')
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      
      return createResponse(data);
    } catch (error) {
      console.error("Error fetching policy:", error);
      return createResponse(false, null, error);
    }
  },
  
  async createPolicy(policyData: Partial<Policy>) {
    try {
      const client = getClient();
      const id = policyData.id || uuidv4();
      
      const { data, error } = await client
        .from('policies')
        .insert({ ...policyData, id })
        .select()
        .single();
      
      if (error) throw error;
      
      return createResponse(data);
    } catch (error) {
      console.error("Error creating policy:", error);
      return createResponse(false, null, error);
    }
  },
  
  async updatePolicy(policyId: string, policyData: Partial<Policy>) {
    try {
      const client = getClient();
      const { data, error } = await client
        .from('policies')
        .update({ 
          ...policyData,
          updated_at: new Date().toISOString()
        })
        .eq('id', policyId)
        .select()
        .single();
      
      if (error) throw error;
      
      return createResponse(data);
    } catch (error) {
      console.error("Error updating policy:", error);
      return createResponse(false, null, error);
    }
  },
  
  async deletePolicy(policyId: string) {
    try {
      const client = getClient();
      const { error } = await client
        .from('policies')
        .delete()
        .eq('id', policyId);
      
      if (error) throw error;
      
      return createResponse(true);
    } catch (error) {
      console.error("Error deleting policy:", error);
      return createResponse(false, null, error);
    }
  },
  
  async updatePolicyStatus(policyId: string, status: string) {
    try {
      const client = getClient();
      const { data, error } = await client
        .from('policies')
        .update({ 
          workflow_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', policyId)
        .select()
        .single();
      
      if (error) throw error;
      
      return createResponse(data);
    } catch (error) {
      console.error("Error updating policy status:", error);
      return createResponse(false, null, error);
    }
  }
};
