
import { Policy } from "@/types/policies";

export interface WorkflowPolicy {
  id: string;
  policyNumber: string;
  policyholderName: string;
  insurerName: string;
  startDate: string;
  expiryDate: string;
  premium: number;
  currency: string;
  status: string;
  workflowStatus: string;
  lastUpdated: string;
}

/**
 * Map Policy objects to WorkflowPolicy objects for display in the workflow UI
 */
export const policiesToWorkflowPolicies = (policies: Policy[]): WorkflowPolicy[] => {
  return policies.map(policy => ({
    id: policy.id,
    policyNumber: policy.policy_number,
    policyholderName: policy.policyholder_name,
    insurerName: policy.insurer_name,
    startDate: policy.start_date,
    expiryDate: policy.expiry_date,
    premium: policy.premium,
    currency: policy.currency,
    status: policy.status,
    workflowStatus: policy.workflow_status,
    lastUpdated: policy.updated_at
  }));
};

/**
 * Group policies by their workflow status
 */
export const groupPoliciesByWorkflowStatus = (policies: Policy[]) => {
  return policies.reduce((groups, policy) => {
    const status = policy.workflow_status;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(policy);
    return groups;
  }, {} as Record<string, Policy[]>);
};

/**
 * Calculate policy statistics by workflow status
 */
export const calculatePolicyWorkflowStats = (policies: Policy[]) => {
  const grouped = groupPoliciesByWorkflowStatus(policies);
  
  return {
    draft: grouped.draft?.length || 0,
    in_review: grouped.in_review?.length || 0,
    ready: grouped.ready?.length || 0,
    complete: grouped.complete?.length || 0,
    total: policies.length
  };
};
