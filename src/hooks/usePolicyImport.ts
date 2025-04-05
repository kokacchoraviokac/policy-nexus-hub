
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/AuthContext";
import { v4 as uuidv4 } from "uuid";

interface Policy {
  id?: string;
  policy_number?: string;
  company_id: string;
  policy_type?: string;
  start_date?: string;
  expiry_date?: string;
  premium?: number;
  currency?: string;
  commission_percentage?: number;
  commission_amount?: number;
  commission_type?: string;
  status?: string;
  workflow_status?: string;
  insurer_id?: string;
  insurer_name?: string;
  client_id?: string;
  policyholder_name?: string;
  insured_id?: string;
  insured_name?: string;
  product_id?: string | null;
  product_name?: string | null;
  product_code?: string | null;
  payment_frequency?: string;
  assigned_to?: string | null;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface ValidationErrors {
  [key: number]: string[];
}

export const usePolicyImport = () => {
  const { user } = useAuth();
  const [importedPolicies, setImportedPolicies] = useState<Partial<Policy>[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [invalidPolicies, setInvalidPolicies] = useState<number[]>([]);
  
  // Select file and extract policies
  const handleFileSelect = async (file: File) => {
    try {
      // Parse file (this would be a real CSV parsing function in production)
      const mockPolicies = Array(5).fill(0).map((_, i) => ({
        policy_number: `POL-2023-${1000 + i}`,
        policyholder_name: `Company ${i + 1}`,
        insurer_name: `Insurer ${i % 3 + 1}`,
        premium: 1000 + i * 100,
        currency: "EUR",
        start_date: "2023-01-01",
        expiry_date: "2024-01-01"
      }));
      
      // Set importedPolicies with parsed data
      setImportedPolicies(mockPolicies);
      
      // Validate policies
      const errors: ValidationErrors = {};
      mockPolicies.forEach((policy, index) => {
        if (!policy.policy_number) {
          errors[index] = errors[index] || [];
          errors[index].push("Policy number is required");
        }
        if (!policy.policyholder_name) {
          errors[index] = errors[index] || [];
          errors[index].push("Policyholder name is required");
        }
      });
      
      setValidationErrors(errors);
      setInvalidPolicies(Object.keys(errors).map(Number));
      
    } catch (error) {
      console.error("Error selecting file:", error);
      setImportError("Failed to parse policy data. Please check the file format.");
    }
  };
  
  // Handle file drop for react-dropzone
  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  };
  
  // Import policies to database
  const importPolicies = async () => {
    if (!user) return;
    
    setIsImporting(true);
    setImportSuccess(false);
    setImportError(null);
    
    try {
      const validPolicies = importedPolicies.filter((_, index) => 
        !Object.keys(validationErrors).includes(index.toString())
      );
      
      if (validPolicies.length === 0) {
        setImportError("No valid policies to import");
        setIsImporting(false);
        return;
      }
      
      const now = new Date().toISOString();
      
      // Prepare policies for import
      const policiesToInsert = validPolicies.map(policy => ({
        ...policy,
        id: uuidv4(),
        company_id: user.user_metadata.company_id,
        created_by: user.id,
        created_at: now,
        updated_at: now,
        status: 'active',
        workflow_status: 'in_review',
        // Add expiry_date if missing, required by database schema
        expiry_date: policy.expiry_date || "2099-12-31",
      }));
      
      // Insert policy directly (with type assertion and optional props)
      for (const policy of policiesToInsert) {
        // Prepare the policy object with required fields
        const insertData = {
          ...policy,
          // Ensure required fields are present
          workflow_status: policy.workflow_status || 'in_review'
        };
        
        const { error } = await supabase
          .from('policies')
          .insert([insertData] as any);
        
        if (error) {
          console.error("Error inserting policy:", error);
          setImportError(`Error importing policies: ${error.message}`);
          setIsImporting(false);
          return;
        }
      }
      
      setImportSuccess(true);
    } catch (error) {
      console.error("Error importing policies:", error);
      setImportError("Failed to import policies. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };
  
  return {
    importedPolicies,
    validationErrors,
    handleFileSelect,
    handleFileDrop,
    importPolicies,
    isImporting,
    importSuccess,
    importError,
    invalidPolicies
  };
};
