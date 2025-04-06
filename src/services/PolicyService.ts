import { supabase } from "@/integrations/supabase/client";
import { Policy, PolicyFilterParams } from "@/types/policies";
import { User } from "@/types/auth/userTypes";

// Service class for policy operations
export class PolicyService {
  // Get a list of policies with filtering
  static async getPolicies(params: PolicyFilterParams) {
    try {
      const {
        page = 1,
        pageSize = 10,
        searchTerm,
        status,
        clientId,
        insurerId,
        productId,
        workflowStatus,
        assignedTo,
        startDateFrom,
        startDateTo,
        expiryDateFrom,
        expiryDateTo,
        search
      } = params;

      // Calculate pagination offset
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Start building the query
      let query = supabase.from('policies').select('*', { count: 'exact' });

      // Apply filters
      if (searchTerm) {
        query = query.or(
          `policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%,insurer_name.ilike.%${searchTerm}%`
        );
      }

      if (search) {
        query = query.or(
          `policy_number.ilike.%${search}%,policyholder_name.ilike.%${search}%,insurer_name.ilike.%${search}%`
        );
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (workflowStatus && workflowStatus !== 'all') {
        query = query.eq('workflow_status', workflowStatus);
      }

      if (startDateFrom) {
        query = query.gte('start_date', startDateFrom);
      }

      if (startDateTo) {
        query = query.lte('start_date', startDateTo);
      }

      if (expiryDateFrom) {
        query = query.gte('expiry_date', expiryDateFrom);
      }

      if (expiryDateTo) {
        query = query.lte('expiry_date', expiryDateTo);
      }

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      if (insurerId) {
        query = query.eq('insurer_id', insurerId);
      }

      if (productId) {
        query = query.eq('product_id', productId);
      }

      if (assignedTo) {
        query = query.eq('assigned_to', assignedTo);
      }

      // Apply sorting (newest first by default)
      query = query.order('created_at', { ascending: false });

      // Apply pagination
      query = query.range(from, to);

      // Execute the query
      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data as Policy[],
        totalCount: count || 0,
        error: null
      };
    } catch (error) {
      console.error('Error fetching policies:', error);
      return {
        success: false,
        data: [] as Policy[],
        totalCount: 0,
        error: error
      };
    }
  }

  // Get a single policy by ID
  static async getPolicyById(policyId: string) {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('id', policyId)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Policy,
        error: null
      };
    } catch (error) {
      console.error('Error fetching policy:', error);
      return {
        success: false,
        data: null,
        error: error
      };
    }
  }

  // Create a new policy
  static async createPolicy(policy: Partial<Policy>, userId: string) {
    try {
      const { data, error } = await supabase
        .from('policies')
        .insert({
          ...policy,
          created_by: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Policy,
        error: null
      };
    } catch (error) {
      console.error('Error creating policy:', error);
      return {
        success: false,
        data: null,
        error: error
      };
    }
  }

  // Update an existing policy
  static async updatePolicy(policyId: string, updates: Partial<Policy>) {
    try {
      const { data, error } = await supabase
        .from('policies')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', policyId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data as Policy,
        error: null
      };
    } catch (error) {
      console.error('Error updating policy:', error);
      return {
        success: false,
        data: null,
        error: error
      };
    }
  }

  // Import multiple policies
  static async importPolicies(policies: Partial<Policy>[], userId: string) {
    try {
      // Ensure each policy has required fields
      const preparedPolicies = policies.map(policy => ({
        ...policy,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      // For now, we'll use a single insert to keep it simple
      // In a real app, you might want to batch these for larger imports
      const { data, error } = await supabase
        .from('policies')
        .insert(preparedPolicies as any);

      if (error) throw error;

      return {
        success: true,
        message: `Successfully imported ${policies.length} policies`,
        error: null
      };
    } catch (error) {
      console.error('Error importing policies:', error);
      return {
        success: false,
        message: 'Failed to import policies',
        error: error
      };
    }
  }

  // Delete a policy
  static async deletePolicy(policyId: string) {
    try {
      const { error } = await supabase
        .from('policies')
        .delete()
        .eq('id', policyId);

      if (error) throw error;

      return {
        success: true,
        message: 'Policy successfully deleted',
        error: null
      };
    } catch (error) {
      console.error('Error deleting policy:', error);
      return {
        success: false,
        message: 'Failed to delete policy',
        error: error
      };
    }
  }
}
