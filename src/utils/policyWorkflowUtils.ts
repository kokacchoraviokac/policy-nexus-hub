
import { Policy } from "@/types/policies";

export type PolicyWorkflowStatus = 'draft' | 'in_review' | 'ready' | 'complete';

/**
 * Check if a policy has all required fields filled in
 */
export const isPolicyComplete = (policy: Policy): boolean => {
  const requiredFields = [
    'policy_number',
    'policyholder_name',
    'insurer_name',
    'start_date',
    'expiry_date',
    'premium',
    'currency',
    'policy_type'
  ];
  
  return requiredFields.every(field => {
    // @ts-expect-error - we're using string indexing
    return !!policy[field];
  });
};

/**
 * Get a list of missing required fields
 */
export const getMissingFields = (policy: Policy): string[] => {
  const requiredFields = [
    { key: 'policy_number', name: 'policyNumber' },
    { key: 'policyholder_name', name: 'policyholder' },
    { key: 'insurer_name', name: 'insurer' },
    { key: 'start_date', name: 'startDate' },
    { key: 'expiry_date', name: 'expiryDate' },
    { key: 'premium', name: 'premium' },
    { key: 'currency', name: 'currency' },
    { key: 'policy_type', name: 'policyType' }
  ];
  
  return requiredFields
    .filter(field => {
      // @ts-expect-error - we're using string indexing
      return !policy[field.key];
    })
    .map(field => field.name);
};

/**
 * Get the next workflow status based on the current status
 */
export const getNextWorkflowStatus = (currentStatus: PolicyWorkflowStatus): PolicyWorkflowStatus => {
  switch (currentStatus) {
    case 'draft':
      return 'in_review';
    case 'in_review':
      return 'ready';
    case 'ready':
      return 'complete';
    default:
      return currentStatus;
  }
};

/**
 * Check if a user can move the policy to the next workflow status
 */
export const canMoveToNextStatus = (policy: Policy): boolean => {
  // Draft can always be moved to in_review
  if (policy.workflow_status === 'draft') {
    return true;
  }
  
  // For other statuses, the policy must be complete
  return isPolicyComplete(policy);
};
