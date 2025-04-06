
import { Policy, PolicyAddendum, WorkflowStatus } from "@/types/policies";

export interface WorkflowPolicy extends Policy {
  workflow_status: string;
}

/**
 * Converts a list of Policy objects to WorkflowPolicy objects
 */
export function mapPoliciesToWorkflowPolicies(policies: Policy[]): WorkflowPolicy[] {
  return policies.map(policy => ({
    ...policy,
    workflow_status: policy.workflow_status || WorkflowStatus.DRAFT,
  }));
}

// Alias for backward compatibility
export const policiesToWorkflowPolicies = mapPoliciesToWorkflowPolicies;

/**
 * Map policy status to human-readable text
 */
export function mapPolicyStatusToText(status: string): string {
  const statusMap: Record<string, string> = {
    [WorkflowStatus.DRAFT]: 'Draft',
    [WorkflowStatus.IN_REVIEW]: 'In Review',
    [WorkflowStatus.READY]: 'Ready',
    [WorkflowStatus.COMPLETE]: 'Complete',
    [WorkflowStatus.REVIEW]: 'Review',
    [WorkflowStatus.REJECTED]: 'Rejected',
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
    [WorkflowStatus.DRAFT]: 'secondary',
    [WorkflowStatus.IN_REVIEW]: 'warning',
    [WorkflowStatus.READY]: 'info',
    [WorkflowStatus.COMPLETE]: 'success',
    [WorkflowStatus.REVIEW]: 'warning',
    [WorkflowStatus.REJECTED]: 'destructive',
    'active': 'success',
    'pending': 'warning',
    'expired': 'destructive',
    'cancelled': 'default'
  };
  
  return variantMap[status] || 'default';
}
