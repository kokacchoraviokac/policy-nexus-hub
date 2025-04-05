
import { parse as parseCSV } from 'papaparse';
import { Policy } from '@/types/policies';
import { format } from 'date-fns';

interface CSVRow {
  policy_number: string;
  policy_type: string;
  start_date: string;
  expiry_date: string;
  premium: string;
  currency: string;
  insurer_name: string;
  policyholder_name: string;
  product_name?: string;
  product_id?: string;
  commission_percentage?: string;
  [key: string]: any;
}

export const parseCSVToPolicy = (file: File): Promise<Partial<Policy>[]> => {
  return new Promise((resolve, reject) => {
    parseCSV(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
          reject(new Error('Error parsing CSV file'));
          return;
        }

        try {
          const policies = (results.data as CSVRow[]).map(transformCSVRowToPolicy);
          resolve(policies);
        } catch (error) {
          console.error('Error transforming CSV data:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      }
    });
  });
};

export const transformCSVRowToPolicy = (row: CSVRow): Partial<Policy> => {
  try {
    // Cleanup and transform data
    const startDate = parseDate(row.start_date);
    const expiryDate = parseDate(row.expiry_date);
    
    if (!startDate || !expiryDate) {
      throw new Error('Invalid date format in CSV');
    }

    const premium = parseFloat(row.premium) || 0;
    const commissionPercentage = row.commission_percentage ? parseFloat(row.commission_percentage) : null;
    
    const policy: Partial<Policy> = {
      policy_number: row.policy_number,
      policy_type: row.policy_type || 'external',
      start_date: formatDate(startDate),
      expiry_date: formatDate(expiryDate),
      premium,
      currency: row.currency || 'EUR',
      insurer_name: row.insurer_name,
      policyholder_name: row.policyholder_name,
      product_id: row.product_id || null,
      product_name: row.product_name || null,
      commission_percentage: commissionPercentage,
      commission_amount: commissionPercentage ? (premium * commissionPercentage / 100) : null,
      status: 'active',
      workflow_status: 'draft',
    };

    return policy;
  } catch (error) {
    console.error('Error transforming row:', error, row);
    throw error;
  }
};

export const validatePolicy = (policy: Partial<Policy>): string[] => {
  const errors: string[] = [];

  if (!policy.policy_number) {
    errors.push('Policy number is required');
  }

  if (!policy.start_date) {
    errors.push('Start date is required');
  }

  if (!policy.expiry_date) {
    errors.push('Expiry date is required');
  }

  if (!policy.insurer_name) {
    errors.push('Insurer name is required');
  }

  if (!policy.policyholder_name) {
    errors.push('Policyholder name is required');
  }

  if (policy.premium === undefined || policy.premium <= 0) {
    errors.push('Premium must be greater than 0');
  }

  return errors;
};

export const generatePolicyTemplate = (): string => {
  const headers = [
    'policy_number',
    'policy_type',
    'start_date',
    'expiry_date',
    'premium',
    'currency',
    'insurer_name',
    'policyholder_name',
    'product_name',
    'commission_percentage'
  ];

  const exampleRow = [
    'POL-123456',
    'external',
    '2023-01-01',
    '2024-01-01',
    '1000',
    'EUR',
    'Example Insurance Co',
    'Example Client',
    'Car Insurance',
    '15'
  ];

  return `${headers.join(',')}\n${exampleRow.join(',')}`;
};

const parseDate = (dateString: string): Date | null => {
  // Try different date formats
  const formats = [
    new Date(dateString), // standard JS date parsing
    // Add more date parsing strategies if needed
  ];

  for (const parsed of formats) {
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};

const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const preparePolicyForSave = (policy: Partial<Policy>, companyId: string, userId: string): Partial<Policy> => {
  return {
    ...policy,
    company_id: companyId,
    created_by: userId,
    commission_amount: policy.premium && policy.commission_percentage 
      ? (policy.premium * policy.commission_percentage / 100) 
      : 0,
    workflow_status: 'draft',
    status: 'active',
  };
};
