import { supabase } from "@/integrations/supabase/client";
import { 
  Policy, 
  PolicyAddendum, 
  InvalidPolicy, 
  WorkflowStatus, 
  PolicyStatus
} from "@/types/policies";

// Add updatePolicyStatus method
export const updatePolicyStatus = async (policyId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('policies')
      .update({ workflow_status: status })
      .eq('id', policyId)
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error updating policy status:", error);
    return { success: false, error };
  }
};

// Fix the savePolicies method
export const savePolicies = async (policies: Partial<Policy>[]) => {
  try {
    const currentDate = new Date().toISOString();
    const invalidPolicies: InvalidPolicy[] = [];
    
    const processedPolicies = policies.map(policy => {
      // Make sure all required fields are present with proper default values
      return {
        ...policy,
        created_at: currentDate,
        updated_at: currentDate,
        workflow_status: WorkflowStatus.DRAFT,
        status: PolicyStatus.ACTIVE,
        currency: policy.currency || 'EUR',
        created_by: policy.created_by || 'system',
        expiry_date: policy.expiry_date || '', // Default to empty string for now
        start_date: policy.start_date || '',
        policy_type: policy.policy_type || 'standard'
      };
    });
    
    const { data, error } = await supabase
      .from('policies')
      .insert(processedPolicies)
      .select();
    
    if (error) {
      // Add the failed policy to invalid policies
      policies.forEach(policy => {
        invalidPolicies.push({
          row: 0,
          errors: [error.message],
          data: policy
        });
      });
      return { success: false, failed: invalidPolicies };
    }
    
    return { success: data, failed: invalidPolicies };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Failed to save policies" 
    };
  }
};

// Fix the createAddendum method
export const createAddendum = async (addendum: Partial<PolicyAddendum>) => {
  try {
    const currentDate = new Date().toISOString();
    
    const processedAddendum = {
      ...addendum,
      created_at: currentDate,
      updated_at: currentDate,
      status: 'active',
      workflow_status: WorkflowStatus.DRAFT,
      created_by: addendum.created_by || 'system',
      description: addendum.description || '',
      effective_date: addendum.effective_date || currentDate,
      policy_id: addendum.policy_id || ''
    };
    
    const { data, error } = await supabase
      .from('policy_addendums')
      .insert(processedAddendum)
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Failed to create addendum" 
    };
  }
};

// Export updatePolicy method (renamed from updatePolicyStatus for consistency)
export const updatePolicy = async (policyId: string, updatedData: Partial<Policy>) => {
  try {
    // Add updated_at timestamp
    const dataWithTimestamp = {
      ...updatedData,
      updated_at: new Date().toISOString()
    };
    
    // Fix expiry_date if it's not provided
    if (!dataWithTimestamp.expiry_date) {
      const { data } = await supabase
        .from('policies')
        .select('expiry_date')
        .eq('id', policyId)
        .single();
      
      if (data && data.expiry_date) {
        dataWithTimestamp.expiry_date = data.expiry_date;
      }
    }
    
    const { data, error } = await supabase
      .from('policies')
      .update(dataWithTimestamp)
      .eq('id', policyId)
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Failed to update policy" 
    };
  }
};

import { safeSupabaseQuery } from "@/utils/safeSupabaseQuery";

export class PolicyService {
  /**
   * Fetch policies with optional filtering
   */
  static async fetchPolicies(filters: any = {}) {
    try {
      let query = supabase.from("policies").select("*");
      
      // Apply filters
      if (filters.searchTerm) {
        query = query.or(
          `policy_number.ilike.%${filters.searchTerm}%,policyholder_name.ilike.%${filters.searchTerm}%`
        );
      }
      
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      
      if (filters.workflowStatus) {
        query = query.eq("workflow_status", filters.workflowStatus);
      }
      
      if (filters.startDateFrom) {
        query = query.gte("start_date", filters.startDateFrom);
      }
      
      if (filters.startDateTo) {
        query = query.lte("start_date", filters.startDateTo);
      }
      
      if (filters.expiryDateFrom) {
        query = query.gte("expiry_date", filters.expiryDateFrom);
      }
      
      if (filters.expiryDateTo) {
        query = query.lte("expiry_date", filters.expiryDateTo);
      }
      
      // Add pagination
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      
      query = query
        .order("created_at", { ascending: false })
        .range(startIndex, startIndex + pageSize - 1);
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data as Policy[];
    } catch (error) {
      console.error("Error fetching policies:", error);
      throw error;
    }
  }
  
  /**
   * Fetch a single policy by ID
   */
  static async fetchPolicyById(id: string) {
    try {
      const { data, error } = await supabase
        .from("policies")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Policy;
    } catch (error) {
      console.error("Error fetching policy:", error);
      throw error;
    }
  }
  
  /**
   * Update a policy
   */
  static async updatePolicy(id: string, updates: Partial<Policy>) {
    try {
      const { data, error } = await supabase
        .from("policies")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Policy;
    } catch (error) {
      console.error("Error updating policy:", error);
      throw error;
    }
  }
  
  /**
   * Import policies
   */
  static async importPolicies(policies: Partial<Policy>[], user: User): Promise<{ success: Policy[], failed: InvalidPolicy[] }> {
    const now = new Date().toISOString();
    const success: Policy[] = [];
    const failed: InvalidPolicy[] = [];
    
    // Process each policy
    for (const policy of policies) {
      try {
        // Ensure required fields are present
        if (!policy.policy_number || !policy.policyholder_name || !policy.insurer_name || !policy.start_date || !policy.expiry_date || !policy.premium) {
          throw new Error("Missing required policy fields");
        }

        // Prepare policy data with required fields
        const policyData = {
          ...policy,
          created_by: user.id,
          created_at: now,
          updated_at: now,
          company_id: user.companyId || user.company_id,
          workflow_status: "review", // All imported policies start in review status
          status: "active",
          currency: policy.currency || "EUR"
        };
        
        // Insert the policy
        const { data, error } = await supabase
          .from("policies")
          .insert(policyData)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        success.push(data as Policy);
      } catch (error) {
        console.error("Error importing policy:", error);
        failed.push({
          policy,
          errors: [(error as Error).message]
        });
      }
    }
    
    return { success, failed };
  }
  
  /**
   * Fetch policy addendums
   */
  static async fetchPolicyAddendums(policyId: string) {
    try {
      const { data, error } = await supabase
        .from("policy_addendums")
        .select("*")
        .eq("policy_id", policyId)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as PolicyAddendum[];
    } catch (error) {
      console.error("Error fetching addendums:", error);
      throw error;
    }
  }
  
  /**
   * Create policy addendum
   */
  static async createAddendum(addendum: Partial<PolicyAddendum>, user: User) {
    try {
      const now = new Date().toISOString();
      
      // Ensure required fields are present
      if (!addendum.policy_id || !addendum.description || !addendum.effective_date) {
        throw new Error("Missing required addendum fields");
      }
      
      // Prepare addendum data with required fields
      const addendumData = {
        ...addendum,
        created_by: user.id,
        created_at: now,
        updated_at: now,
        company_id: user.companyId || user.company_id,
        status: "active",
        workflow_status: "complete",
        addendum_number: addendum.addendum_number || `A-${Date.now()}`,
        lien_status: addendum.lien_status || false
      };
      
      const { data, error } = await supabase
        .from("policy_addendums")
        .insert(addendumData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as PolicyAddendum;
    } catch (error) {
      console.error("Error creating addendum:", error);
      throw error;
    }
  }
}

export default PolicyService;
