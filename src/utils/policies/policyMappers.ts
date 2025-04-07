
import { Policy, PolicyAddendum, PolicyWorkflowStatus } from "@/types/policies";

export interface WorkflowPolicy extends Policy {
  workflow_status: string;
}

/**
 * Converts a list of Policy objects to WorkflowPolicy objects
 */
export function mapPoliciesToWorkflowPolicies(policies: Policy[]): WorkflowPolicy[] {
  return policies.map(policy => ({
    ...policy,
    workflow_status: policy.workflow_status || PolicyWorkflowStatus.DRAFT,
  }));
}

// Alias for backward compatibility
export const policiesToWorkflowPolicies = mapPoliciesToWorkflowPolicies;

/**
 * Map policy status to human-readable text
 */
export function mapPolicyStatusToText(status: string): string {
  const statusMap: Record<string, string> = {
    [PolicyWorkflowStatus.DRAFT]: 'Draft',
    [PolicyWorkflowStatus.IN_REVIEW]: 'In Review',
    [PolicyWorkflowStatus.READY]: 'Ready',
    [PolicyWorkflowStatus.COMPLETE]: 'Complete',
    [PolicyWorkflowStatus.REVIEW]: 'Review',
    [PolicyWorkflowStatus.REJECTED]: 'Rejected',
    [PolicyWorkflowStatus.PENDING]: 'Pending',
    [PolicyWorkflowStatus.PROCESSING]: 'Processing',
    [PolicyWorkflowStatus.FINALIZED]: 'Finalized',
    [PolicyWorkflowStatus.NEEDS_REVIEW]: 'Needs Review',
    'active': 'Active',
    'pending': 'Pending',
    'expired': 'Expired',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status] || status;
}

/**
 * Map policy status to badge variants
 */
export function mapPolicyStatusToBadgeVariant(status: string): string {
  const variantMap: Record<string, string> = {
    [PolicyWorkflowStatus.DRAFT]: 'secondary',
    [PolicyWorkflowStatus.IN_REVIEW]: 'warning',
    [PolicyWorkflowStatus.READY]: 'info',
    [PolicyWorkflowStatus.COMPLETE]: 'success',
    [PolicyWorkflowStatus.REVIEW]: 'warning',
    [PolicyWorkflowStatus.REJECTED]: 'destructive',
    [PolicyWorkflowStatus.PENDING]: 'warning',
    [PolicyWorkflowStatus.PROCESSING]: 'info',
    [PolicyWorkflowStatus.FINALIZED]: 'success',
    [PolicyWorkflowStatus.NEEDS_REVIEW]: 'destructive',
    'active': 'success',
    'pending': 'warning',
    'expired': 'destructive',
    'cancelled': 'default'
  };
  
  return variantMap[status] || 'default';
}
