
import { Policy } from "@/types/policies";

export interface WorkflowPolicy {
  id: string;
  policyNumber: string;
  client: string;
  insurer: string;
  product: string;
  startDate: string;
  endDate: string;
  premium: number;
  currency: string;
  status: string;
  assignedTo?: string;
  lastModified?: string;
  client_name?: string; // Add client_name for compatibility
}

/**
 * Maps API Policy to WorkflowPolicy for UI display
 */
export function mapPolicyToWorkflowPolicy(policy: Policy): WorkflowPolicy {
  return {
    id: policy.id,
    policyNumber: policy.policy_number,
    client: policy.client_name || "Unknown Client",
    insurer: policy.insurer_name,
    product: policy.product_name || policy.product_code || "Unknown Product",
    startDate: policy.start_date,
    endDate: policy.expiry_date,
    premium: policy.premium,
    currency: policy.currency || "EUR",
    status: policy.workflow_status || policy.status,
    assignedTo: policy.assigned_to,
    lastModified: policy.updated_at,
    client_name: policy.client_name // Map client_name for compatibility
  };
}

/**
 * Maps multiple policies to workflow policies
 */
export function mapPoliciesToWorkflowPolicies(policies: Policy[]): WorkflowPolicy[] {
  return policies.map(mapPolicyToWorkflowPolicy);
}

/**
 * Count policies by status
 */
export function countPoliciesByStatus(policies: Policy[], status: string): number {
  return policies.filter(policy => policy.workflow_status === status || policy.status === status).length;
}
