
import { useState } from 'react';
import { parse } from 'csv-parse/sync';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Policy } from '@/types/policies';
import { toast } from '@/hooks/use-toast';

export type ValidationErrors = Record<number, string[]>;

export const usePolicyImport = () => {
  const { user } = useAuth();
  const [importedPolicies, setImportedPolicies] = useState<Partial<Policy>[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isImporting, setIsImporting] = useState(false);

  // Calculate invalid policies based on validation errors
  const invalidPolicies = Object.keys(validationErrors).map(index => {
    return {
      policy: importedPolicies[parseInt(index)],
      errors: validationErrors[parseInt(index)]
    };
  });

  const parseCSVFile = async (file: File): Promise<Partial<Policy>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csv = parse(e.target!.result as string, {
            columns: true,
            skip_empty_lines: true,
            trim: true
          });
          
          // Transform the CSV data to match Policy type
          const policies = csv.map((row: any): Partial<Policy> => ({
            policy_number: row.policy_number,
            insurer_name: row.insurer_name,
            client_name: row.client_name,
            start_date: row.start_date,
            expiry_date: row.expiry_date,
            premium_amount: parseFloat(row.premium_amount),
            status: row.status || 'pending',
            policy_type: row.policy_type || 'standard'
          }));
          
          resolve(policies);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  };

  const validatePolicies = (policies: Partial<Policy>[]): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    policies.forEach((policy, index) => {
      const policyErrors: string[] = [];
      
      if (!policy.policy_number) policyErrors.push('Policy number is required');
      if (!policy.client_name) policyErrors.push('Client name is required');
      if (!policy.insurer_name) policyErrors.push('Insurer name is required');
      if (!policy.start_date) policyErrors.push('Start date is required');
      if (!policy.expiry_date) policyErrors.push('Expiry date is required');
      
      if (policyErrors.length > 0) {
        errors[index] = policyErrors;
      }
    });
    
    return errors;
  };

  const handleFileSelect = async (file: File) => {
    setIsImporting(true);
    
    try {
      const policies = await parseCSVFile(file);
      const errors = validatePolicies(policies);
      
      setImportedPolicies(policies);
      setValidationErrors(errors);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast({
        title: 'Error',
        description: 'Failed to parse the file. Please check the format and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  };

  const savePolicies = async (): Promise<boolean> => {
    setIsImporting(true);
    
    try {
      // Only insert policies that passed validation
      const validPolicies = importedPolicies.filter((_, index) => 
        !Object.keys(validationErrors).includes(index.toString())
      );
      
      if (validPolicies.length === 0) {
        toast({
          title: 'No valid policies',
          description: 'No valid policies to import. Please fix validation errors and try again.',
          variant: 'destructive'
        });
        return false;
      }
      
      // Prepare policies for insertion with required fields
      const policiesToInsert = validPolicies.map(policy => ({
        ...policy,
        company_id: user?.user_metadata?.company_id || 'default',
        created_by: user?.id || 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        workflow_status: 'pending_review'
      }));
      
      // Use type assertion to fix TypeScript error
      const { data, error } = await supabase
        .from('policies')
        .insert(policiesToInsert as any);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Policies imported',
        description: `Successfully imported ${validPolicies.length} policies.`
      });
      
      return true;
    } catch (error) {
      console.error('Error saving policies:', error);
      toast({
        title: 'Error',
        description: 'Failed to save policies. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  const clearImportData = () => {
    setImportedPolicies([]);
    setValidationErrors({});
  };

  return {
    importedPolicies,
    validationErrors,
    handleFileSelect,
    handleFileDrop,
    isImporting,
    invalidPolicies,
    parseCSVFile,
    savePolicies,
    clearImportData
  };
};
