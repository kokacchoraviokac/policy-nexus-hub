
import { Policy } from "@/types/policies";
import { WorkflowPolicy } from "@/hooks/useWorkflowPolicies";

/**
 * Converts a Policy object to a WorkflowPolicy object
 */
export const policyToWorkflowPolicy = (policy: Policy): WorkflowPolicy => {
  return {
    id: policy.id,
    policyNumber: policy.policy_number,
    insurer: policy.insurer_name,
    client: policy.policyholder_name,
    product: policy.product_name || '',
    startDate: new Date(policy.start_date),
    endDate: new Date(policy.expiry_date),
    status: policy.workflow_status,
    premium: policy.premium,
    currency: policy.currency,
    createdAt: new Date(policy.created_at),
    updatedAt: new Date(policy.updated_at)
  };
};

/**
 * Converts an array of Policy objects to WorkflowPolicy objects
 */
export const policiesToWorkflowPolicies = (policies: Policy[]): WorkflowPolicy[] => {
  return policies.map(policy => policyToWorkflowPolicy(policy));
};
