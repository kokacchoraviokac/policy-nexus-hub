import { Policy } from "@/types/policies";
import Papa from "papaparse";

/**
 * Parse CSV data and convert it to Policy objects
 */
export const parsePolicyCSV = (csvData: string): Partial<Policy>[] => {
  const result = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true
  });

  if (result.errors.length > 0) {
    console.error("CSV parsing errors:", result.errors);
    throw new Error(`Error parsing CSV: ${result.errors[0].message}`);
  }

  return result.data.map((row: any) => {
    // Convert CSV fields to Policy object with string dates
    return {
      policy_number: row.policy_number || row.PolicyNumber,
      insurer_name: row.insurer_name || row.InsurerName,
      insurer_id: row.insurer_id,
      policyholder_name: row.policyholder_name || row.PolicyholderName,
      policyholder_id: row.policyholder_id,
      insured_name: row.insured_name || row.InsuredName,
      insured_id: row.insured_id,
      // Keep dates as strings to match the Policy type
      start_date: row.start_date || undefined,
      expiry_date: row.expiry_date || undefined,
      premium: row.premium ? parseFloat(row.premium) : undefined,
      currency: row.currency,
      product_name: row.product_name || row.product,
      notes: row.notes,
      workflow_status: 'draft',
      status: 'active'
    };
  });
};

/**
 * Validate imported policies for required fields
 */
export const validateImportedPolicies = (policies: Partial<Policy>[]): { 
  valid: Partial<Policy>[];
  invalid: { policy: Partial<Policy>; errors: string[] }[];
} => {
  const valid: Partial<Policy>[] = [];
  const invalid: { policy: Partial<Policy>; errors: string[] }[] = [];

  policies.forEach(policy => {
    const errors: string[] = [];

    // Check required fields
    if (!policy.policy_number) errors.push("Missing policy number");
    if (!policy.insurer_name) errors.push("Missing insurer name");
    if (!policy.policyholder_name) errors.push("Missing policyholder name");
    
    if (errors.length === 0) {
      valid.push(policy);
    } else {
      invalid.push({ policy, errors });
    }
  });

  return { valid, invalid };
};

/**
 * Create a sample CSV template for policy import
 */
export const generatePolicyCSVTemplate = (): string => {
  const headers = [
    "policy_number",
    "insurer_name",
    "policyholder_name",
    "insured_name",
    "start_date",
    "expiry_date",
    "premium",
    "currency",
    "product_name",
    "notes"
  ];

  const sampleRow = [
    "POL-12345",
    "Example Insurance Co",
    "Client Company Ltd",
    "Client Company Ltd",
    "2023-01-01",
    "2024-01-01",
    "1000",
    "EUR",
    "Business Insurance",
    "Sample policy"
  ];

  const csv = [
    headers.join(","),
    sampleRow.join(",")
  ].join("\n");

  return csv;
};
