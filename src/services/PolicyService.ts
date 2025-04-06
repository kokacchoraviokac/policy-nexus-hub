import { supabase } from "@/integrations/supabase/client";
import { Policy, InvalidPolicy, PolicyAddendum } from "@/types/policies";
import { User } from "@/types/auth/userTypes";
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

/**
 * Update policy status
 * @param policyId Policy ID
 * @param status New workflow status
 * @returns Updated policy data
 */
export const updatePolicyStatus = async (policyId: string, status: string) => {
  try {
    // Use existing updatePolicy method with just the status update
    return await updatePolicy(policyId, { workflow_status: status });
  } catch (error) {
    console.error("Error updating policy status:", error);
    throw error;
  }
};

/**
 * Create policy with validation
 * 
 * @param policyData Partial policy data
 * @returns Created policy or error
 */
export const createPolicy = async (policyData: Partial<Policy>) => {
  try {
    // Ensure required fields have values
    const required = [
      'policy_number', 
      'policyholder_name', 
      'insurer_name', 
      'start_date', 
      'expiry_date', 
      'premium', 
      'policy_type'
    ];
    
    const missingFields = required.filter(field => !policyData[field]);
    
    if (missingFields.length > 0) {
      return {
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        invalidPolicy: {
          errors: [`Missing required fields: ${missingFields.join(', ')}`],
          row: 0,
          data: policyData
        }
      };
    }
    
    // Prepare data with defaults
    const data = {
      ...policyData,
      created_by: policyData.created_by || 'system',
      created_at: policyData.created_at || new Date().toISOString(),
      updated_at: policyData.updated_at || new Date().toISOString(),
      company_id: policyData.company_id || '',
      workflow_status: policyData.workflow_status || 'draft',
      status: policyData.status || 'active',
      currency: policyData.currency || 'EUR',
    };
    
    // Ensure expiry_date is present for the supabase insertion
    if (!data.expiry_date) {
      data.expiry_date = '';
    }
    
    const { data: createdPolicy, error } = await supabase
      .from('policies')
      .insert(data)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating policy:", error);
      return {
        success: false,
        error: error.message,
        invalidPolicy: {
          errors: [error.message],
          row: 0,
          data: policyData
        }
      };
    }
    
    return {
      success: true,
      data: createdPolicy
    };
  } catch (error) {
    console.error("Error in createPolicy:", error);
    return {
      success: false,
      error: error.message,
      invalidPolicy: {
        errors: [error.message],
        row: 0,
        data: policyData
      }
    };
  }
};

/**
 * Create policy addendum
 */
export const createAddendum = async (addendumData: Partial<PolicyAddendum>) => {
  try {
    // Ensure required fields have values
    const required = [
      'policy_id',
      'addendum_number',
      'effective_date',
      'description'
    ];
    
    const missingFields = required.filter(field => !addendumData[field]);
    
    if (missingFields.length > 0) {
      return {
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      };
    }
    
    // Prepare data with defaults
    const data = {
      ...addendumData,
      created_by: addendumData.created_by || 'system',
      created_at: addendumData.created_at || new Date().toISOString(),
      updated_at: addendumData.updated_at || new Date().toISOString(),
      company_id: addendumData.company_id || '',
      status: addendumData.status || 'active',
      workflow_status: addendumData.workflow_status || 'draft',
      addendum_number: addendumData.addendum_number || '',
      lien_status: addendumData.lien_status || false,
      description: addendumData.description || '', // Ensure description is present
      effective_date: addendumData.effective_date || '', // Ensure effective_date is present 
      policy_id: addendumData.policy_id || '', // Ensure policy_id is present
    };
    
    const { data: createdAddendum, error } = await supabase
      .from('policy_addendums')
      .insert(data)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating addendum:", error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      data: createdAddendum
    };
  } catch (error) {
    console.error("Error in createAddendum:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default PolicyService;
