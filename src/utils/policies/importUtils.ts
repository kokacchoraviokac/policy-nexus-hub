
import Papa from 'papaparse';
import { Policy } from '@/types/policies';

interface ValidationError {
  field: string;
  message: string;
}

/**
 * Parse a CSV file with policy data
 */
export const parsePolicyCSV = (csvText: string): any[] => {
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transform: (value, field) => {
      // Clean up values
      if (value === '') return undefined;
      return value;
    }
  });
  
  return results.data;
};

/**
 * Validate imported policies and separate valid from invalid
 */
export const validateImportedPolicies = (policies: any[]): {
  valid: Partial<Policy>[];
  invalid: { policy: Partial<Policy>; errors: string[] }[];
} => {
  const valid: Partial<Policy>[] = [];
  const invalid: { policy: Partial<Policy>; errors: string[] }[] = [];
  
  policies.forEach((policy) => {
    const errors: string[] = [];
    
    // Validate required fields
    if (!policy.policy_number) errors.push('Policy number is required');
    if (!policy.insurer_name) errors.push('Insurer name is required');
    if (!policy.policyholder_name) errors.push('Policyholder name is required');
    if (!policy.start_date) errors.push('Start date is required');
    if (!policy.expiry_date) errors.push('Expiry date is required');
    if (!policy.premium) errors.push('Premium amount is required');
    if (!policy.currency) errors.push('Currency is required');
    
    // Validate date formats
    if (policy.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(policy.start_date)) {
      errors.push('Invalid start date format (YYYY-MM-DD)');
    }
    
    if (policy.expiry_date && !/^\d{4}-\d{2}-\d{2}$/.test(policy.expiry_date)) {
      errors.push('Invalid expiry date format (YYYY-MM-DD)');
    }
    
    // Validate numeric values
    if (policy.premium && isNaN(Number(policy.premium))) {
      errors.push('Premium must be a number');
    }
    
    if (policy.commission_percentage && isNaN(Number(policy.commission_percentage))) {
      errors.push('Commission percentage must be a number');
    }
    
    // Convert to Policy type for valid entries
    const policyData: Partial<Policy> = {
      ...policy,
      premium: policy.premium ? Number(policy.premium) : 0,
      commission_percentage: policy.commission_percentage ? Number(policy.commission_percentage) : undefined,
      workflow_status: 'draft',
      status: 'active'
    };
    
    if (errors.length === 0) {
      valid.push(policyData);
    } else {
      invalid.push({ policy: policyData, errors });
    }
  });
  
  return { valid, invalid };
};

/**
 * Generate a downloadable template CSV for policy import
 */
export const generatePolicyImportTemplate = (): string => {
  const templateData = [
    {
      policy_number: 'POL-001',
      policy_type: 'Standard',
      insurer_name: 'Example Insurance',
      product_name: 'Auto Insurance',
      product_code: 'AUTO-001',
      policyholder_name: 'John Doe',
      insured_name: 'John Doe',
      start_date: '2023-01-01',
      expiry_date: '2024-01-01',
      premium: '1000',
      currency: 'EUR',
      payment_frequency: 'annual',
      commission_percentage: '10',
      commission_type: 'automatic',
      notes: 'Example policy'
    }
  ];
  
  return Papa.unparse(templateData);
};
