
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Policy } from "@/types/policies";
import { getUser } from "@/stores/authStore";
import Papa from "papaparse";

export type ValidationErrors = Record<number, string[]>;

export interface CsvRow {
  policy_number: string;
  policy_type: string;
  insurer_id: string;
  insurer_name: string;
  product_id: string;
  product_name: string;
  client_id: string;
  policyholder_name: string;
  insured_name: string;
  start_date: string;
  expiry_date: string;
  premium: string;
  currency: string;
  payment_frequency: string;
  commission_type: string;
  commission_percentage: string;
  notes: string;
}

const usePolicyImport = () => {
  const [importedPolicies, setImportedPolicies] = useState<Partial<Policy>[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isImporting, setIsImporting] = useState(false);

  // Convert validation errors to required format for components
  const invalidPolicies: number[] = Object.keys(validationErrors).map(key => parseInt(key, 10));

  const handleFileSelect = async (file: File) => {
    setIsImporting(true);
    
    try {
      // Read and parse CSV file
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const { data, errors } = results;
          
          if (errors.length > 0) {
            console.error("CSV parsing errors:", errors);
            return;
          }
          
          // Validate and transform the data
          const { parsedPolicies, errors: validationErrors } = validateAndTransformPolicies(data as CsvRow[]);
          
          setImportedPolicies(parsedPolicies);
          setValidationErrors(validationErrors);
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
        }
      });
    } catch (error) {
      console.error("Error reading file:", error);
    } finally {
      setIsImporting(false);
    }
  };
  
  const validateAndTransformPolicies = (rows: CsvRow[]): { 
    parsedPolicies: Partial<Policy>[]; 
    errors: ValidationErrors;
  } => {
    const parsedPolicies: Partial<Policy>[] = [];
    const errors: ValidationErrors = {};
    
    rows.forEach((row, index) => {
      const rowErrors: string[] = [];
      
      // Validate required fields
      if (!row.policy_number) rowErrors.push("Policy number is required");
      if (!row.policyholder_name) rowErrors.push("Policyholder name is required");
      if (!row.insurer_name) rowErrors.push("Insurer name is required");
      if (!row.start_date) rowErrors.push("Start date is required");
      if (!row.expiry_date) rowErrors.push("Expiry date is required");
      if (!row.premium) rowErrors.push("Premium is required");
      
      // Transform to policy object
      const policy: Partial<Policy> = {
        policy_number: row.policy_number,
        policy_type: row.policy_type,
        insurer_id: row.insurer_id,
        insurer_name: row.insurer_name,
        product_id: row.product_id || null,
        product_name: row.product_name || null,
        client_id: row.client_id,
        policyholder_name: row.policyholder_name,
        insured_name: row.insured_name || null,
        start_date: row.start_date,
        expiry_date: row.expiry_date,
        premium: parseFloat(row.premium) || 0,
        currency: row.currency || "EUR",
        payment_frequency: row.payment_frequency || null,
        commission_type: row.commission_type || null,
        commission_percentage: row.commission_percentage ? parseFloat(row.commission_percentage) : null,
        commission_amount: 0, // Will be calculated based on percentage
        notes: row.notes || null,
        status: "active",
        workflow_status: "review"
      };
      
      // Calculate commission amount if percentage is provided
      if (policy.commission_percentage && policy.premium) {
        policy.commission_amount = (policy.commission_percentage / 100) * policy.premium;
      }
      
      parsedPolicies.push(policy);
      
      if (rowErrors.length > 0) {
        errors[index] = rowErrors;
      }
    });
    
    return { parsedPolicies, errors };
  };
  
  const savePolicies = async (): Promise<boolean> => {
    if (importedPolicies.length === 0) return false;
    
    setIsImporting(true);
    
    try {
      const user = getUser();
      
      // Prepare policies with required fields
      const policiesToSave = importedPolicies.map(policy => ({
        ...policy,
        company_id: user.company_id,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      // Insert policies one by one to handle errors better
      for (const policy of policiesToSave) {
        const { error } = await supabase
          .from('policies')
          .insert(policy);
          
        if (error) {
          console.error("Error saving policy:", error);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error saving policies:", error);
      return false;
    } finally {
      setIsImporting(false);
    }
  };
  
  const clearImportData = () => {
    setImportedPolicies([]);
    setValidationErrors({});
  };
  
  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  };
  
  const downloadTemplate = () => {
    const csvContent = [
      "policy_number,policy_type,insurer_name,policyholder_name,insured_name,start_date,expiry_date,premium,currency,payment_frequency,commission_type,commission_percentage,notes",
      "POL-001,Life,Insurer Co,John Doe,Jane Doe,2023-01-01,2024-01-01,1000,EUR,annual,percentage,10,Sample policy"
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'policy_import_template.csv');
    a.click();
  };
  
  return {
    importedPolicies,
    validationErrors,
    handleFileSelect,
    handleFileDrop,
    isImporting,
    savePolicies,
    clearImportData,
    downloadTemplate,
    invalidPolicies
  };
};

export { usePolicyImport };
