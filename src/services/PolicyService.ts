
import { supabase } from "@/integrations/supabase/client";
import { Policy, PolicyAddendum, InvalidPolicy, WorkflowStatus, PolicyStatus } from "@/types/policies";
import { formatDate } from "@/utils/dateUtils";

class PolicyServiceImplementation {
  /**
   * Fetches policies with optional filtering
   */
  async fetchPolicies(filters = {}) {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching policies:", error);
      throw error;
    }
  }

  /**
   * Get a policy by ID
   */
  async getPolicy(policyId: string) {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('id', policyId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching policy:", error);
      throw error;
    }
  }

  /**
   * Create multiple policies
   */
  async createPolicies(policies: Partial<Policy>[]) {
    try {
      if (!Array.isArray(policies) || policies.length === 0) {
        throw new Error("No policies to create");
      }

      // Ensure all required fields are present in each policy
      const validPolicies = policies.map(policy => ({
        ...policy,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        workflow_status: WorkflowStatus.DRAFT,
        status: PolicyStatus.PENDING,
        currency: policy.currency || 'EUR',
        created_by: policy.created_by || '',
        expiry_date: policy.expiry_date || '',
        insurer_name: policy.insurer_name || '',
        policy_number: policy.policy_number || '',
        policyholder_name: policy.policyholder_name || '',
        start_date: policy.start_date || '',
        premium: policy.premium || 0,
        policy_type: policy.policy_type || '',
        company_id: policy.company_id || ''
      }));

      const { data, error } = await supabase
        .from('policies')
        .insert(validPolicies);

      if (error) throw error;
      return { success: data || [], failed: [] };
    } catch (error) {
      console.error("Error creating policies:", error);
      throw error;
    }
  }

  /**
   * Create a policy addendum
   */
  async createAddendum(addendum: Partial<PolicyAddendum>) {
    try {
      const newAddendum = {
        ...addendum,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: addendum.status || 'pending',
        workflow_status: addendum.workflow_status || WorkflowStatus.DRAFT,
        created_by: addendum.created_by || '',
        description: addendum.description || '',
        effective_date: addendum.effective_date || '',
        policy_id: addendum.policy_id || '',
        addendum_number: addendum.addendum_number || '',
        lien_status: addendum.lien_status || false,
        premium_adjustment: addendum.premium_adjustment,
        company_id: addendum.company_id || ''
      };

      const { data, error } = await supabase
        .from('policy_addendums')
        .insert(newAddendum)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating addendum:", error);
      throw error;
    }
  }

  /**
   * Import policies from CSV
   */
  async importPolicies(policyData: any[], userId: string, companyId: string) {
    const validPolicies = [];
    const invalidPolicies = [];

    // Process the policy data
    for (let index = 0; index < policyData.length; index++) {
      const row = policyData[index];
      const policy = this.mapRowToPolicy(row, userId, companyId);
      
      // Validate the policy
      const errors = this.validatePolicy(policy);
      
      if (errors.length === 0) {
        validPolicies.push(policy);
      } else {
        invalidPolicies.push({
          row: index + 1,
          errors,
          data: policy
        });
      }
    }

    // If there are valid policies, insert them
    if (validPolicies.length > 0) {
      try {
        await this.createPolicies(validPolicies);
        return { success: validPolicies, failed: invalidPolicies };
      } catch (error) {
        console.error("Error importing policies:", error);
        return { success: [], failed: invalidPolicies };
      }
    }

    return { success: [], failed: invalidPolicies };
  }

  /**
   * Map CSV row to policy object
   */
  private mapRowToPolicy(row: any, userId: string, companyId: string): Partial<Policy> {
    return {
      policy_number: row.policy_number || row['Policy Number'] || '',
      policyholder_name: row.policyholder_name || row['Policyholder'] || '',
      insurer_name: row.insurer_name || row['Insurer'] || '',
      insured_name: row.insured_name || row['Insured'] || '',
      start_date: this.formatDateFromImport(row.start_date || row['Start Date']),
      expiry_date: this.formatDateFromImport(row.expiry_date || row['Expiry Date']),
      premium: this.parseNumberValue(row.premium || row['Premium']),
      currency: row.currency || row['Currency'] || 'EUR',
      policy_type: row.policy_type || row['Policy Type'] || '',
      payment_frequency: row.payment_frequency || row['Payment Frequency'] || '',
      commission_percentage: this.parseNumberValue(row.commission_percentage || row['Commission %']),
      status: 'pending',
      workflow_status: WorkflowStatus.DRAFT,
      created_by: userId,
      company_id: companyId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Validate a policy object
   */
  private validatePolicy(policy: Partial<Policy>): string[] {
    const errors = [];

    if (!policy.policy_number) errors.push('Policy number is required');
    if (!policy.policyholder_name) errors.push('Policyholder name is required');
    if (!policy.insurer_name) errors.push('Insurer name is required');
    if (!policy.start_date) errors.push('Start date is required');
    if (!policy.expiry_date) errors.push('Expiry date is required');
    if (!policy.premium) errors.push('Premium is required');
    if (!policy.policy_type) errors.push('Policy type is required');

    return errors;
  }

  /**
   * Format date from import
   */
  private formatDateFromImport(dateStr: string): string {
    if (!dateStr) return '';
    try {
      return formatDate(new Date(dateStr));
    } catch (error) {
      return '';
    }
  }

  /**
   * Parse number value from import
   */
  private parseNumberValue(value: any): number {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    
    const parsed = parseFloat(value.toString().replace(/,/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Update a policy
   */
  async updatePolicy(policyId: string, policyData: Partial<Policy>) {
    try {
      const { data, error } = await supabase
        .from('policies')
        .update({
          ...policyData,
          updated_at: new Date().toISOString()
        })
        .eq('id', policyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating policy:", error);
      throw error;
    }
  }

  /**
   * Update a policy's workflow status
   */
  async updatePolicyStatus(policyId: string, status: string) {
    return this.updatePolicy(policyId, { workflow_status: status });
  }
  
  /**
   * Update a policy addendum
   */
  async updateAddendum(addendumId: string, addendumData: Partial<PolicyAddendum>) {
    try {
      const { data, error } = await supabase
        .from('policy_addendums')
        .update({
          ...addendumData,
          updated_at: new Date().toISOString()
        })
        .eq('id', addendumId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating addendum:", error);
      throw error;
    }
  }

  /**
   * Validate and format policies for import
   */
  validateImportedPolicies(rows: any[], userId: string, companyId: string) {
    const validPolicies: Partial<Policy>[] = [];
    const errors: Record<number, string[]> = {};

    rows.forEach((row, index) => {
      const policy = this.mapRowToPolicy(row, userId, companyId);
      const validationErrors = this.validatePolicy(policy);

      if (validationErrors.length > 0) {
        errors[index] = validationErrors;
      }

      validPolicies.push(policy);
    });

    return { policies: validPolicies, errors };
  }
}

const PolicyService = new PolicyServiceImplementation();
export default PolicyService;
