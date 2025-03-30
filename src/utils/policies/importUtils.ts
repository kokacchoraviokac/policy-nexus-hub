
import { Policy } from "@/types/policies";
import Papa from "papaparse";

/**
 * Parse CSV data and convert it to Policy objects
 */
export const parsePolicyCSV = (csvData: string): Partial<Policy>[] => {
  const result = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
    transform: (value) => value.trim(),
  });

  if (result.errors.length > 0) {
    console.error("CSV parsing errors:", result.errors);
    throw new Error(`Error parsing CSV: ${result.errors[0].message}`);
  }

  return result.data.map((row: any) => {
    // Map fields with common variations to standard names
    return {
      policy_number: row.policy_number || row.policy_no || row.policynumber || row.policy || "",
      policy_type: row.policy_type || row.policytype || "Standard",
      insurer_name: row.insurer_name || row.insurer || row.insurance_company || row.insurername || "",
      insurer_id: row.insurer_id,
      policyholder_name: row.policyholder_name || row.policyholder || row.client_name || row.client || "",
      policyholder_id: row.policyholder_id || row.client_id,
      insured_name: row.insured_name || row.insured || row.insured_party || row.policyholder_name || row.policyholder || "",
      insured_id: row.insured_id,
      // Handle date formats with validation
      start_date: row.start_date || row.policy_start || row.start || "",
      expiry_date: row.expiry_date || row.end_date || row.policy_end || row.expiry || "",
      premium: row.premium ? parseFloat(row.premium) : undefined,
      currency: row.currency || "EUR",
      product_name: row.product_name || row.product || row.insurance_product || "",
      product_code: row.product_code || row.code || "",
      product_id: row.product_id,
      notes: row.notes || row.additional_info || row.comments || "",
      payment_frequency: row.payment_frequency || row.frequency || "annual",
      commission_type: row.commission_type || "automatic",
      commission_percentage: row.commission_percentage ? parseFloat(row.commission_percentage) : undefined,
      commission_amount: row.commission_amount ? parseFloat(row.commission_amount) : undefined,
      workflow_status: "draft",
      status: "active"
    };
  });
};

/**
 * Validate imported policies for required fields and data format
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
    if (!policy.policy_number) errors.push("Policy number is required");
    if (!policy.insurer_name) errors.push("Insurer name is required");
    if (!policy.policyholder_name) errors.push("Policyholder name is required");
    if (!policy.start_date) errors.push("Start date is required");
    if (!policy.expiry_date) errors.push("Expiry date is required");
    if (policy.premium === undefined) errors.push("Premium is required");
    if (!policy.currency) errors.push("Currency is required");
    
    // Validate date formats
    if (policy.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(policy.start_date)) {
      errors.push("Start date must be in YYYY-MM-DD format");
    }
    
    if (policy.expiry_date && !/^\d{4}-\d{2}-\d{2}$/.test(policy.expiry_date)) {
      errors.push("Expiry date must be in YYYY-MM-DD format");
    }
    
    // Validate dates are valid
    if (policy.start_date && /^\d{4}-\d{2}-\d{2}$/.test(policy.start_date)) {
      const startDate = new Date(policy.start_date);
      if (isNaN(startDate.getTime())) {
        errors.push("Start date is invalid");
      }
    }
    
    if (policy.expiry_date && /^\d{4}-\d{2}-\d{2}$/.test(policy.expiry_date)) {
      const expiryDate = new Date(policy.expiry_date);
      if (isNaN(expiryDate.getTime())) {
        errors.push("Expiry date is invalid");
      }
    }
    
    // Check expiry date is after start date
    if (
      policy.start_date && 
      policy.expiry_date && 
      /^\d{4}-\d{2}-\d{2}$/.test(policy.start_date) && 
      /^\d{4}-\d{2}-\d{2}$/.test(policy.expiry_date)
    ) {
      const startDate = new Date(policy.start_date);
      const expiryDate = new Date(policy.expiry_date);
      
      if (!isNaN(startDate.getTime()) && !isNaN(expiryDate.getTime()) && expiryDate <= startDate) {
        errors.push("Expiry date must be after start date");
      }
    }
    
    // Validate premium is a number
    if (policy.premium !== undefined && isNaN(policy.premium)) {
      errors.push("Premium must be a number");
    }
    
    // Validate commission percentage if present
    if (policy.commission_percentage !== undefined) {
      if (isNaN(policy.commission_percentage)) {
        errors.push("Commission percentage must be a number");
      } else if (policy.commission_percentage < 0 || policy.commission_percentage > 100) {
        errors.push("Commission percentage must be between 0 and 100");
      }
    }
    
    // Validate currency codes
    if (policy.currency) {
      const validCurrencies = ['EUR', 'USD', 'GBP', 'RSD', 'MKD'];
      if (!validCurrencies.includes(policy.currency.toUpperCase())) {
        errors.push(`Invalid currency code: ${policy.currency}. Valid options: ${validCurrencies.join(', ')}`);
      }
    }
    
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
    "product_code",
    "payment_frequency",
    "commission_percentage",
    "notes"
  ];

  const sampleRow1 = [
    "POL-12345",
    "Example Insurance Co",
    "Client Company Ltd",
    "Client Company Ltd",
    "2023-01-01",
    "2024-01-01",
    "1000",
    "EUR",
    "Business Insurance",
    "BI-001",
    "annual",
    "10",
    "Sample policy from insurer"
  ];
  
  const sampleRow2 = [
    "POL-67890",
    "Another Insurance Inc",
    "John Smith",
    "John Smith",
    "2023-06-15",
    "2024-06-14",
    "750.50",
    "USD",
    "Auto Insurance",
    "AI-002",
    "monthly",
    "12.5",
    "Imported from insurer system"
  ];

  const csv = [
    headers.join(","),
    sampleRow1.join(","),
    sampleRow2.join(",")
  ].join("\n");

  return csv;
};
