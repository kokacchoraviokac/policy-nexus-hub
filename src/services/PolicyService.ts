
import { supabase } from "@/integrations/supabase/client";
import { Policy, InvalidPolicy, PolicyAddendum } from "@/types/policies";
import { User } from "@/types/auth/user";

export class PolicyService {
  /**
   * Fetch policies with optional filtering
   */
  static async fetchPolicies(filters: any = {}) {
    let query = supabase
      .from("policies")
      .select("*");
    
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
  }
  
  /**
   * Fetch a single policy by ID
   */
  static async fetchPolicyById(id: string) {
    const { data, error } = await supabase
      .from("policies")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Policy;
  }
  
  /**
   * Update a policy
   */
  static async updatePolicy(id: string, updates: Partial<Policy>) {
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
        // Prepare policy data
        const policyData = {
          ...policy,
          created_by: user.id,
          created_at: now,
          updated_at: now,
          company_id: user.companyId || user.company_id,
          workflow_status: "review" // All imported policies start in review status
        };
        
        // Insert the policy
        const { data, error } = await supabase
          .from("policies")
          .insert({
            ...policyData,
            company_id: user.companyId || user.company_id,
            workflow_status: "review"
          })
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
    const { data, error } = await supabase
      .from("policy_addendums")
      .select("*")
      .eq("policy_id", policyId)
      .order("created_at", { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as PolicyAddendum[];
  }
  
  /**
   * Create policy addendum
   */
  static async createAddendum(addendum: Partial<PolicyAddendum>, user: User) {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("policy_addendums")
      .insert({
        ...addendum,
        created_by: user.id,
        created_at: now,
        updated_at: now,
        company_id: user.companyId || user.company_id,
        status: "active",
        workflow_status: "complete"
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as PolicyAddendum;
  }
}

export default PolicyService;
