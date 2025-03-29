
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Policy } from "@/types/policies";

interface ImportedPolicy {
  policy_number: string;
  policy_type?: string;
  insurer_name: string;
  product_name?: string;
  product_code?: string;
  policyholder_name: string;
  insured_name?: string;
  start_date: string;
  expiry_date: string;
  premium: number | string;
  currency: string;
  payment_frequency?: string;
  commission_percentage?: number | string;
  commission_type?: string;
  notes?: string;
}

interface ImportResult {
  successful: number;
  failed: Array<{
    row: number;
    reason: string;
  }>;
}

/**
 * Validate a single policy record
 */
const validatePolicy = (policy: any, index: number): { valid: boolean; error?: string } => {
  // Check required fields
  const requiredFields = [
    'policy_number',
    'insurer_name',
    'policyholder_name',
    'start_date',
    'expiry_date',
    'premium',
    'currency'
  ];
  
  for (const field of requiredFields) {
    if (!policy[field]) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  // Validate date formats
  const dateFields = ['start_date', 'expiry_date'];
  for (const field of dateFields) {
    if (policy[field] && !/^\d{4}-\d{2}-\d{2}$/.test(policy[field])) {
      return { valid: false, error: `Invalid date format for ${field}, expected YYYY-MM-DD` };
    }
  }
  
  // Validate premium and commission are numbers
  if (isNaN(Number(policy.premium))) {
    return { valid: false, error: 'Premium must be a number' };
  }
  
  if (policy.commission_percentage && isNaN(Number(policy.commission_percentage))) {
    return { valid: false, error: 'Commission percentage must be a number' };
  }
  
  return { valid: true };
};

/**
 * Transform imported policy data to match database schema
 */
const transformPolicyData = async (policy: ImportedPolicy): Promise<Policy> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  
  // Get the user's company ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', userId)
    .single();
  
  const companyId = profile?.company_id;
  
  if (!companyId) {
    throw new Error("User's company ID not found");
  }
  
  // Ensure premium and commission are numbers
  const premium = typeof policy.premium === 'string' 
    ? parseFloat(policy.premium) 
    : policy.premium;
  
  const commissionPercentage = policy.commission_percentage 
    ? (typeof policy.commission_percentage === 'string' 
        ? parseFloat(policy.commission_percentage) 
        : policy.commission_percentage)
    : null;
  
  // Calculate commission amount if percentage is provided
  const commissionAmount = commissionPercentage 
    ? (premium * commissionPercentage / 100) 
    : null;
  
  // Create the transformed policy object with all required fields
  return {
    id: uuidv4(),
    policy_number: policy.policy_number,
    policy_type: policy.policy_type || 'Unknown',
    insurer_name: policy.insurer_name,
    product_name: policy.product_name || null,
    product_code: policy.product_code || null,
    policyholder_name: policy.policyholder_name,
    insured_name: policy.insured_name || null,
    start_date: policy.start_date,
    expiry_date: policy.expiry_date,
    premium,
    currency: policy.currency,
    payment_frequency: policy.payment_frequency || null,
    commission_type: policy.commission_type || 'automatic',
    commission_percentage: commissionPercentage,
    commission_amount: commissionAmount,
    notes: policy.notes || null,
    status: 'active',
    workflow_status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: userId,
    company_id: companyId,
    insurer_id: null,
    insured_id: null,
    product_id: null,
    client_id: null,
    assigned_to: null
  };
};

/**
 * Import policies from parsed CSV data
 */
export const importPolicies = async (policies: any[]): Promise<ImportResult> => {
  const result: ImportResult = {
    successful: 0,
    failed: []
  };
  
  const validPolicies: Policy[] = [];
  
  // Validate each policy and transform valid ones
  for (let i = 0; i < policies.length; i++) {
    const policy = policies[i];
    const validation = validatePolicy(policy, i);
    
    if (validation.valid) {
      try {
        const transformedPolicy = await transformPolicyData(policy);
        validPolicies.push(transformedPolicy);
      } catch (error) {
        result.failed.push({
          row: i + 2, // +2 because index 0 + 1 for header line + 1 for human-readable row number
          reason: error instanceof Error ? error.message : 'Transformation error'
        });
      }
    } else {
      result.failed.push({
        row: i + 2, // +2 because index 0 + 1 for header line + 1 for human-readable row number
        reason: validation.error || 'Validation failed'
      });
    }
  }
  
  // Insert valid policies in batches to improve performance
  const BATCH_SIZE = 50;
  
  for (let i = 0; i < validPolicies.length; i += BATCH_SIZE) {
    const batch = validPolicies.slice(i, i + BATCH_SIZE);
    
    const { data, error } = await supabase
      .from('policies')
      .insert(batch)
      .select();
    
    if (error) {
      console.error("Error inserting policy batch:", error);
      // Add all policies in this batch to failed
      for (let j = 0; j < batch.length; j++) {
        result.failed.push({
          row: i + j + 2, // +2 because index 0 + 1 for header + 1 for human-readable row
          reason: `Database error: ${error.message}`
        });
      }
    } else {
      result.successful += data.length;
    }
  }
  
  return result;
};
