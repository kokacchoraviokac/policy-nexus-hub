
import Papa from 'papaparse';

/**
 * Parse a CSV file using Papa Parse
 * @param file The CSV file to parse
 * @returns A promise that resolves to the parsed data
 */
export const parseCSVFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Validate a policy row from CSV import
 * @param policy The policy object to validate
 * @returns An array of validation error messages
 */
export const validatePolicyImport = (policy: any): string[] => {
  const errors: string[] = [];
  
  // Required fields
  if (!policy.policy_number) {
    errors.push('Policy number is required');
  }
  
  if (!policy.policyholder_name) {
    errors.push('Policyholder name is required');
  }
  
  if (!policy.insurer_name) {
    errors.push('Insurer name is required');
  }
  
  // Date validation
  if (policy.start_date && isNaN(Date.parse(policy.start_date))) {
    errors.push('Start date must be a valid date');
  }
  
  if (policy.expiry_date && isNaN(Date.parse(policy.expiry_date))) {
    errors.push('Expiry date must be a valid date');
  }
  
  // Numeric fields
  if (policy.premium && isNaN(Number(policy.premium))) {
    errors.push('Premium must be a number');
  }
  
  if (policy.commission_percentage && isNaN(Number(policy.commission_percentage))) {
    errors.push('Commission percentage must be a number');
  }
  
  return errors;
};

/**
 * Map CSV data to policy objects
 * @param csvData The parsed CSV data
 * @returns An array of policy objects with validation errors
 */
export const mapCSVToPolicies = (csvData: any[]): { policy: any; errors: string[] }[] => {
  return csvData.map(row => {
    // Map CSV columns to policy fields
    const policy = {
      policy_number: row['Policy Number'] || row['policy_number'],
      policyholder_name: row['Policyholder'] || row['policyholder_name'],
      insurer_name: row['Insurer'] || row['insurer_name'],
      premium: parseFloat(row['Premium'] || row['premium'] || '0'),
      currency: row['Currency'] || row['currency'] || 'EUR',
      start_date: row['Start Date'] || row['start_date'],
      expiry_date: row['Expiry Date'] || row['expiry_date'],
      product_name: row['Product'] || row['product_name'],
      payment_frequency: row['Payment Frequency'] || row['payment_frequency'],
      commission_percentage: parseFloat(row['Commission %'] || row['commission_percentage'] || '0'),
      notes: row['Notes'] || row['notes']
    };
    
    // Validate the policy
    const errors = validatePolicyImport(policy);
    
    return { policy, errors };
  });
};
