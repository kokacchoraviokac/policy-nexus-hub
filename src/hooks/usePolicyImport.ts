
import { useState } from "react";
import { Policy } from "@/types/policies";
import { parsePolicyCSV, validateImportedPolicies } from "@/utils/policies/importUtils";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { toast } from "sonner";

export const usePolicyImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importedPolicies, setImportedPolicies] = useState<Partial<Policy>[]>([]);
  const [invalidPolicies, setInvalidPolicies] = useState<{ policy: Partial<Policy>; errors: string[] }[]>([]);
  const supabase = useSupabaseClient();

  const parseCSVFile = async (file: File): Promise<void> => {
    setIsImporting(true);
    
    try {
      const text = await file.text();
      const policies = parsePolicyCSV(text);
      
      const { valid, invalid } = validateImportedPolicies(policies);
      
      setImportedPolicies(valid);
      setInvalidPolicies(invalid);
      
      if (invalid.length > 0) {
        toast.warning(`${invalid.length} policies have validation issues.`);
      }
      
      if (valid.length > 0) {
        toast.success(`Successfully parsed ${valid.length} policies.`);
      } else {
        toast.error("No valid policies found in the file.");
      }
    } catch (error: any) {
      console.error("Error parsing CSV:", error);
      toast.error(`Error parsing file: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const savePolicies = async (): Promise<boolean> => {
    if (importedPolicies.length === 0) {
      toast.error("No valid policies to import.");
      return false;
    }
    
    setIsImporting(true);
    
    try {
      // Prepare policies with required fields for insertion
      // Ensure each policy has all the required fields with proper types
      const policiesToInsert = importedPolicies.map(policy => {
        // Make sure all required fields are present and not undefined
        return {
          policy_number: policy.policy_number || '',
          policy_type: policy.policy_type || 'Standard',
          insurer_name: policy.insurer_name || '',
          insurer_id: policy.insurer_id,
          policyholder_name: policy.policyholder_name || '',
          client_id: policy.client_id,
          insured_name: policy.insured_name || policy.policyholder_name || '',
          insured_id: policy.insured_id,
          product_name: policy.product_name || '',
          product_id: policy.product_id,
          product_code: policy.product_code,
          start_date: policy.start_date || new Date().toISOString().split('T')[0],
          expiry_date: policy.expiry_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          premium: policy.premium || 0,
          currency: policy.currency || 'EUR',
          payment_frequency: policy.payment_frequency || 'annual',
          commission_type: policy.commission_type || 'automatic',
          commission_percentage: policy.commission_percentage,
          commission_amount: policy.commission_amount,
          notes: policy.notes,
          status: 'active',
          workflow_status: 'draft',
          company_id: 'demo-company-id', // Use a default or get from context
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: undefined,  // This will be null if not provided
          assigned_to: undefined, // This will be null if not provided
        };
      });
      
      // Insert policies into database one by one to avoid batch issues
      let successCount = 0;
      
      for (const policy of policiesToInsert) {
        const { data, error } = await supabase
          .from("policies")
          .insert(policy)
          .select();
        
        if (error) {
          console.error("Error saving policy:", error, policy);
          toast.error(`Error saving policy ${policy.policy_number}: ${error.message}`);
        } else {
          successCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} policies.`);
        
        // Reset state after successful import
        setImportedPolicies([]);
        setInvalidPolicies([]);
        
        return true;
      } else {
        toast.error("Failed to import any policies.");
        return false;
      }
    } catch (error: any) {
      console.error("Error saving policies:", error);
      toast.error(`Error saving policies: ${error.message}`);
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  const clearImportData = () => {
    setImportedPolicies([]);
    setInvalidPolicies([]);
  };

  return {
    isImporting,
    importedPolicies,
    invalidPolicies,
    parseCSVFile,
    savePolicies,
    clearImportData
  };
};
