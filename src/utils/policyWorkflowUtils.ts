
import { Policy } from "@/types/policies";

/**
 * Policy workflow status types
 */
export type PolicyWorkflowStatus = 'draft' | 'in_review' | 'ready' | 'complete';

/**
 * Check if a policy has all required fields filled
 */
export const isPolicyComplete = (policy: Policy): boolean => {
  const requiredFields = [
    policy.policy_number,
    policy.insurer_name,
    policy.policyholder_name,
    policy.start_date,
    policy.expiry_date,
    policy.premium,
    policy.currency
  ];
  
  return requiredFields.every(field => !!field);
};

/**
 * Get missing required fields for a policy
 */
export const getMissingFields = (policy: Policy): string[] => {
  const missingFields = [];
  
  if (!policy.policy_number) missingFields.push('policyNumber');
  if (!policy.insurer_name) missingFields.push('insurerName');
  if (!policy.policyholder_name) missingFields.push('policyholderName');
  if (!policy.start_date) missingFields.push('startDate');
  if (!policy.expiry_date) missingFields.push('expiryDate');
  if (!policy.premium) missingFields.push('premium');
  if (!policy.currency) missingFields.push('currency');
  
  return missingFields;
};

/**
 * Get the next workflow status
 */
export const getNextWorkflowStatus = (currentStatus: PolicyWorkflowStatus): PolicyWorkflowStatus => {
  switch (currentStatus) {
    case 'draft':
      return 'in_review';
    case 'in_review':
      return 'ready';
    case 'ready':
      return 'complete';
    case 'complete':
      return 'complete'; // Already at final status
    default:
      return 'draft';
  }
};

/**
 * Check if a policy can move to the next workflow status
 */
export const canAdvanceWorkflow = (policy: Policy, hasRequiredDocuments: boolean): boolean => {
  // Draft to in_review doesn't require completeness
  if (policy.workflow_status === 'draft') {
    return true;
  }
  
  // For other transitions, all required fields must be complete
  const isComplete = isPolicyComplete(policy);
  
  // For final step, also check documents
  if (policy.workflow_status === 'ready') {
    return isComplete && hasRequiredDocuments;
  }
  
  return isComplete;
};
