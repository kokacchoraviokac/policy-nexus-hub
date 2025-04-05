
import { parse } from 'csv-parse/sync';
import { Policy } from '@/types/policies';

/**
 * Parse a CSV file and extract policy data
 * @param file The CSV file to parse
 */
export const parseCSVFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error('Failed to read file');
        }
        
        const csvString = event.target.result.toString();
        const records = parse(csvString, {
          columns: true,
          skip_empty_lines: true,
          trim: true
        });
        
        resolve(records);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

/**
 * Validate imported policy data
 * @param policies Array of policy data to validate
 */
export const validatePolicyData = (policies: any[]): Record<number, string[]> => {
  const errors: Record<number, string[]> = {};
  
  policies.forEach((policy, index) => {
    const policyErrors: string[] = [];
    
    // Required fields
    if (!policy.policy_number) {
      policyErrors.push('Policy number is required');
    }
    
    if (!policy.policy_type) {
      policyErrors.push('Policy type is required');
    }
    
    if (!policy.policyholder_name) {
      policyErrors.push('Policyholder name is required');
    }
    
    if (!policy.insurer_name) {
      policyErrors.push('Insurer name is required');
    }
    
    if (!policy.start_date) {
      policyErrors.push('Start date is required');
    }
    
    if (!policy.expiry_date) {
      policyErrors.push('Expiry date is required');
    }
    
    if (!policy.premium) {
      policyErrors.push('Premium is required');
    } else if (isNaN(Number(policy.premium))) {
      policyErrors.push('Premium must be a number');
    }
    
    // Date validations
    if (policy.start_date && policy.expiry_date) {
      const startDate = new Date(policy.start_date);
      const expiryDate = new Date(policy.expiry_date);
      
      if (isNaN(startDate.getTime())) {
        policyErrors.push('Start date is invalid');
      }
      
      if (isNaN(expiryDate.getTime())) {
        policyErrors.push('Expiry date is invalid');
      }
      
      if (startDate > expiryDate) {
        policyErrors.push('Start date cannot be after expiry date');
      }
    }
    
    // Add errors for this policy if any were found
    if (policyErrors.length > 0) {
      errors[index] = policyErrors;
    }
  });
  
  return errors;
};

/**
 * Map CSV data to Policy structure
 * @param csvData Raw data from CSV file
 */
export const mapCSVToPolicies = (csvData: any[]): Partial<Policy>[] => {
  return csvData.map(record => {
    return {
      policy_number: record.policy_number,
      policy_type: record.policy_type,
      policyholder_name: record.policyholder_name,
      insurer_name: record.insurer_name,
      insurer_id: record.insurer_id,
      product_name: record.product_name,
      product_id: record.product_id,
      client_id: record.client_id,
      start_date: record.start_date,
      expiry_date: record.expiry_date,
      premium: parseFloat(record.premium),
      currency: record.currency || "EUR",
      payment_frequency: record.payment_frequency,
      commission_percentage: record.commission_percentage ? parseFloat(record.commission_percentage) : undefined,
      commission_amount: record.commission_amount ? parseFloat(record.commission_amount) : undefined,
      commission_type: record.commission_type,
      notes: record.notes,
      insured_name: record.insured_name,
      insured_id: record.insured_id,
      status: record.status || "active",
      workflow_status: record.workflow_status || "review_needed"
    };
  });
};
