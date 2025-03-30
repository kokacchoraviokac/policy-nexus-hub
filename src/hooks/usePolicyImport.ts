
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
      const policiesToInsert = importedPolicies.map(policy => ({
        ...policy,
        company_id: 'demo-company-id', // Use a default or get from context
        status: 'active',
        workflow_status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      
      // Insert policies into database
      const { data, error } = await supabase
        .from("policies")
        .insert(policiesToInsert)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success(`Successfully imported ${data.length} policies.`);
      
      // Reset state after successful import
      setImportedPolicies([]);
      setInvalidPolicies([]);
      
      return true;
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
