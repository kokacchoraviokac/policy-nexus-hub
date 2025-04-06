
import { supabase } from "@/integrations/supabase/client";
import { Policy, PolicyFilterParams } from "@/types/policies";
import { User } from "@/types/auth/userTypes";

interface ServiceResponse<T> {
  data: T;
  error: Error | null;
}

export const fetchPolicies = async (
  filterParams: PolicyFilterParams,
  user?: User
): Promise<ServiceResponse<{ policies: Policy[]; totalCount: number }>> => {
  try {
    const { 
      searchTerm, 
      status, 
      dateFrom, 
      dateTo, 
      clientId,
      insurerId,
      agentId,
      page = 1, 
      pageSize = 10,
      sortBy = 'updated_at',
      sortOrder = 'desc'
    } = filterParams;

    // Adjust for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Start building the query
    let query = supabase
      .from('policies')
      .select('*', { count: 'exact' });

    // Apply filters
    if (searchTerm) {
      query = query.or(
        `policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%,insurer_name.ilike.%${searchTerm}%`
      );
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (dateFrom) {
      query = query.gte('start_date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('expiry_date', dateTo);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    if (insurerId) {
      query = query.eq('insurer_id', insurerId);
    }

    if (agentId) {
      query = query.eq('assigned_to', agentId);
    }

    // If a user is provided, filter by company
    if (user?.companyId) {
      query = query.eq('company_id', user.companyId);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(from, to);

    // Execute the query
    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: {
        policies: data as Policy[],
        totalCount: count || 0
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching policies:', error);
    return {
      data: { policies: [], totalCount: 0 },
      error: error as Error
    };
  }
};

export const fetchPolicyById = async (
  policyId: string,
  user?: User
): Promise<ServiceResponse<Policy>> => {
  try {
    let query = supabase.from('policies').select('*').eq('id', policyId);
    
    // If a user is provided, filter by company
    if (user?.companyId) {
      query = query.eq('company_id', user.companyId);
    }
    
    const { data, error } = await query.single();
    
    if (error) throw error;
    
    return {
      data: data as Policy,
      error: null
    };
  } catch (error) {
    console.error('Error fetching policy by ID:', error);
    return {
      data: {} as Policy,
      error: error as Error
    };
  }
};

export const createPolicy = async (
  policy: Partial<Policy>,
  user: User
): Promise<ServiceResponse<Policy>> => {
  try {
    // Ensure company_id is set for the new policy
    const policyWithCompany = {
      ...policy,
      company_id: user.companyId,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('policies')
      .insert([policyWithCompany])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      data: data as Policy,
      error: null
    };
  } catch (error) {
    console.error('Error creating policy:', error);
    return {
      data: {} as Policy,
      error: error as Error
    };
  }
};

export const updatePolicy = async (
  policyId: string,
  updates: Partial<Policy>,
  user?: User
): Promise<ServiceResponse<Policy>> => {
  try {
    // Add updated_at timestamp
    const policyUpdates = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    let query = supabase
      .from('policies')
      .update(policyUpdates)
      .eq('id', policyId);
    
    // If a user is provided, filter by company
    if (user?.companyId) {
      query = query.eq('company_id', user.companyId);
    }
    
    const { data, error } = await query.select().single();
    
    if (error) throw error;
    
    return {
      data: data as Policy,
      error: null
    };
  } catch (error) {
    console.error('Error updating policy:', error);
    return {
      data: {} as Policy,
      error: error as Error
    };
  }
};

export const deletePolicy = async (
  policyId: string,
  user?: User
): Promise<ServiceResponse<boolean>> => {
  try {
    let query = supabase
      .from('policies')
      .delete()
      .eq('id', policyId);
    
    // If a user is provided, filter by company
    if (user?.companyId) {
      query = query.eq('company_id', user.companyId);
    }
    
    const { error } = await query;
    
    if (error) throw error;
    
    return {
      data: true,
      error: null
    };
  } catch (error) {
    console.error('Error deleting policy:', error);
    return {
      data: false,
      error: error as Error
    };
  }
};

export const importPolicies = async (
  policies: Partial<Policy>[],
  user: User
): Promise<ServiceResponse<{ successful: number; failed: number }>> => {
  try {
    // Ensure each policy has company_id and created_by
    const preparedPolicies = policies.map(policy => ({
      ...policy,
      company_id: user.companyId,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    // Split into chunks if needed (to avoid max rows limit)
    const chunkSize = 100;
    let successful = 0;
    let failed = 0;
    
    for (let i = 0; i < preparedPolicies.length; i += chunkSize) {
      const chunk = preparedPolicies.slice(i, i + chunkSize);
      
      const { data, error } = await supabase
        .from('policies')
        .insert(chunk as any);
      
      if (error) {
        console.error('Error importing policies chunk:', error);
        failed += chunk.length;
      } else {
        successful += chunk.length;
      }
    }
    
    return {
      data: { successful, failed },
      error: null
    };
  } catch (error) {
    console.error('Error importing policies:', error);
    return {
      data: { successful: 0, failed: policies.length },
      error: error as Error
    };
  }
};
