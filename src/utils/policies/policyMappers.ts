
import { Policy } from "@/types/policies";

/**
 * Interface for policies in the workflow
 */
export interface WorkflowPolicy {
  id: string;
  policyNumber: string;
  policyholderName: string;
  insurerName: string;
  startDate: string;
  expiryDate: string;
  premium: number;
  currency: string;
  workflowStatus: string;
  status?: string;
  missingFields?: string[];
}

/**
 * Convert policy objects to workflow policy format
 */
export function policiesToWorkflowPolicies(policies: Policy[]): WorkflowPolicy[] {
  return policies.map(policy => ({
    id: policy.id,
    policyNumber: policy.policy_number,
    policyholderName: policy.policyholder_name,
    insurerName: policy.insurer_name,
    startDate: policy.start_date,
    expiryDate: policy.expiry_date,
    premium: policy.premium,
    currency: policy.currency || "EUR",
    workflowStatus: policy.workflow_status,
    status: policy.status,
    missingFields: getMissingFields(policy)
  }));
}

/**
 * Determine which required fields are missing from a policy
 */
function getMissingFields(policy: Policy): string[] {
  const missingFields: string[] = [];
  
  if (!policy.policy_number) missingFields.push("policyNumber");
  if (!policy.policyholder_name) missingFields.push("policyholderName");
  if (!policy.insurer_name) missingFields.push("insurerName");
  if (!policy.start_date) missingFields.push("startDate");
  if (!policy.expiry_date) missingFields.push("expiryDate");
  if (!policy.premium) missingFields.push("premium");
  
  return missingFields;
}
