
import { parse as csvParse } from 'csv-parse/sync';
import { Policy } from '@/types/policies';

export interface CsvRow {
  policy_number: string;
  policy_type: string;
  insurer_id: string;
  insurer_name: string;
  product_id: string;
  product_name: string;
  premium: string;
  currency: string;
  start_date: string;
  expiry_date: string;
  client_id: string;
  policyholder_name: string;
  insured_name: string;
  status: string;
  workflow_status: string;
  commission_type: string;
  commission_percentage: string;
  commission_amount: string;
  payment_frequency: string;
  notes: string;
}

export interface ValidationErrors {
  [key: number]: string[];
}

export const validatePolicies = (policies: Partial<Policy>[]): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  policies.forEach((policy, index) => {
    const rowErrors: string[] = [];
    
    // Required fields
    if (!policy.policy_number) rowErrors.push("Policy number is required");
    if (!policy.policyholder_name) rowErrors.push("Policyholder is required");
    if (!policy.start_date) rowErrors.push("Start date is required");
    if (!policy.expiry_date) rowErrors.push("Expiry date is required");
    if (!policy.insurer_name) rowErrors.push("Insurer name is required");
    
    // Store errors for this row if any
    if (rowErrors.length > 0) {
      errors[index] = rowErrors;
    }
  });
  
  return errors;
};

export const parseCSV = (csvData: string): Partial<Policy>[] => {
  // Parse CSV data
  const records = csvParse(csvData, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as CsvRow[];
  
  // Map CSV rows to Policy objects
  return records.map(row => ({
    policy_number: row.policy_number,
    policy_type: row.policy_type,
    insurer_id: row.insurer_id || null,
    insurer_name: row.insurer_name,
    product_id: row.product_id || null,
    product_name: row.product_name || null,
    premium: parseFloat(row.premium) || 0,
    currency: row.currency || "EUR",
    start_date: row.start_date,
    expiry_date: row.expiry_date,
    client_id: row.client_id || null,
    policyholder_name: row.policyholder_name,
    insured_name: row.insured_name || row.policyholder_name,
    status: row.status || "active",
    workflow_status: row.workflow_status || "imported",
    commission_type: row.commission_type || null,
    commission_percentage: row.commission_percentage ? parseFloat(row.commission_percentage) : null,
    commission_amount: row.commission_amount ? parseFloat(row.commission_amount) : null,
    payment_frequency: row.payment_frequency || null,
    notes: row.notes || null
  }));
};

export const formatImportData = (policies: Partial<Policy>[], currentUser: any): Partial<Policy>[] => {
  return policies.map(policy => ({
    ...policy,
    created_by: currentUser.id,
    company_id: currentUser.company_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
};

export const generateTemplateData = (): string => {
  const headers = [
    "policy_number",
    "policy_type", 
    "insurer_name",
    "insurer_id",
    "product_name",
    "product_id",
    "premium",
    "currency",
    "start_date",
    "expiry_date",
    "policyholder_name",
    "client_id",
    "insured_name",
    "status",
    "workflow_status",
    "commission_type",
    "commission_percentage",
    "commission_amount",
    "payment_frequency",
    "notes"
  ];
  
  const sampleData = [
    "POL12345",
    "Auto Insurance",
    "Example Insurance Co",
    "",
    "Full Coverage Auto",
    "",
    "1200.00",
    "EUR",
    "2023-01-01",
    "2023-12-31",
    "John Doe",
    "",
    "John Doe",
    "active",
    "imported",
    "percentage",
    "15",
    "180.00",
    "annual",
    "Sample policy"
  ];
  
  return `${headers.join(",")}\n${sampleData.join(",")}`;
};
