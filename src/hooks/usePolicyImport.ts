
import { useState } from 'react';
import { toast } from 'sonner';
import { PolicyService } from '@/services/PolicyService';
import { Policy, ValidationErrors, PolicyStatus, WorkflowStatus } from '@/types/policies';
import { useAuth } from '@/contexts/AuthContext';
import Papa from 'papaparse';

interface InvalidPolicy {
  policy: Partial<Policy>;
  errors: string[];
}

export const usePolicyImport = () => {
  const [importedPolicies, setImportedPolicies] = useState<Partial<Policy>[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const { user } = useAuth();

  const handleFileDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive"
      });
      return;
    }

    handleFileSelect(acceptedFiles[0]);
  };

  const handleFileSelect = async (file: File) => {
    if (!file || !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file format",
        description: "Please select a CSV file.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    
    try {
      // Parse the CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            toast({
              title: "Error parsing CSV",
              description: "There were errors in the CSV file. Please check and try again.",
              variant: "destructive"
            });
            console.error("CSV parsing errors:", results.errors);
            setIsImporting(false);
            return;
          }

          const policies = mapCsvDataToPolicies(results.data);
          const errors = validatePolicies(policies);
          
          setImportedPolicies(policies);
          setValidationErrors(errors);
          
          if (Object.keys(errors).length > 0) {
            toast({
              title: "Validation issues found",
              description: `There are ${Object.keys(errors).length} policies with validation issues.`,
              variant: "warning"
            });
          } else {
            toast({
              title: "File parsed successfully",
              description: `Found ${policies.length} policies ready for import.`,
            });
          }
          
          setIsImporting(false);
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          toast({
            title: "Error parsing CSV",
            description: error.message,
            variant: "destructive"
          });
          setIsImporting(false);
        }
      });
    } catch (error) {
      console.error("File processing error:", error);
      toast({
        title: "Error processing file",
        description: "An unexpected error occurred while processing the file.",
        variant: "destructive"
      });
      setIsImporting(false);
    }
  };

  const mapCsvDataToPolicies = (data: any[]): Partial<Policy>[] => {
    return data.map((row, index) => {
      return {
        policy_number: row['Policy Number'] || row['policy_number'] || '',
        policyholder_name: row['Policyholder'] || row['policyholder_name'] || '',
        insurer_name: row['Insurer'] || row['insurer_name'] || '',
        insured_name: row['Insured'] || row['insured_name'] || row['Policyholder'] || row['policyholder_name'] || '',
        start_date: row['Start Date'] || row['start_date'] || '',
        expiry_date: row['Expiry Date'] || row['expiry_date'] || '',
        premium: parseFloat(row['Premium'] || row['premium'] || '0'),
        currency: row['Currency'] || row['currency'] || 'EUR',
        status: row['Status'] || row['status'] || PolicyStatus.PENDING,
        workflow_status: WorkflowStatus.DRAFT,
        policy_type: row['Policy Type'] || row['policy_type'] || '',
        payment_frequency: row['Payment Frequency'] || row['payment_frequency'] || '',
        commission_percentage: row['Commission %'] ? parseFloat(row['Commission %']) : 
                              row['commission_percentage'] ? parseFloat(row['commission_percentage']) : null,
        notes: row['Notes'] || row['notes'] || '',
      };
    });
  };

  const validatePolicies = (policies: Partial<Policy>[]): ValidationErrors => {
    const errors: ValidationErrors = {};

    policies.forEach((policy, index) => {
      const policyErrors: string[] = [];

      if (!policy.policy_number) {
        policyErrors.push("Policy Number is required");
      }

      if (!policy.policyholder_name) {
        policyErrors.push("Policyholder Name is required");
      }

      if (!policy.insurer_name) {
        policyErrors.push("Insurer Name is required");
      }

      if (!policy.start_date) {
        policyErrors.push("Start Date is required");
      } else if (!isValidDate(policy.start_date)) {
        policyErrors.push("Start Date must be a valid date (YYYY-MM-DD)");
      }

      if (!policy.expiry_date) {
        policyErrors.push("Expiry Date is required");
      } else if (!isValidDate(policy.expiry_date)) {
        policyErrors.push("Expiry Date must be a valid date (YYYY-MM-DD)");
      }

      if (isNaN(policy.premium || 0)) {
        policyErrors.push("Premium must be a valid number");
      }

      if (policyErrors.length > 0) {
        errors[index] = policyErrors;
      }
    });

    return errors;
  };

  const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const savePolicies = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to import policies.",
        variant: "destructive"
      });
      return false;
    }

    if (importedPolicies.length === 0) {
      toast({
        title: "No policies to import",
        description: "Please select a CSV file with policy data first.",
        variant: "destructive"
      });
      return false;
    }

    setIsImporting(true);

    try {
      // Add company_id to all policies
      const policiesToImport = importedPolicies.map(policy => ({
        ...policy,
        company_id: user.companyId || user.company_id,
      }));

      const result = await PolicyService.importPolicies(policiesToImport, user.id);

      if (result.success) {
        toast({
          title: "Import successful",
          description: `Successfully imported ${importedPolicies.length} policies.`,
        });
        setImportSuccess(true);
        return true;
      } else {
        toast({
          title: "Import failed",
          description: result.message || "Failed to import policies.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Policy import error:", error);
      toast({
        title: "Import failed",
        description: "An unexpected error occurred during import.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  const clearImportData = () => {
    setImportedPolicies([]);
    setValidationErrors({});
    setImportSuccess(false);
  };

  // Convert validation errors to a list of invalid policies
  const invalidPolicies: InvalidPolicy[] = Object.entries(validationErrors).map(
    ([index, errors]) => ({
      policy: importedPolicies[parseInt(index, 10)] || {},
      errors
    })
  );

  return {
    importedPolicies,
    validationErrors,
    handleFileSelect,
    handleFileDrop,
    isImporting,
    savePolicies,
    clearImportData,
    importSuccess,
    invalidPolicies,
  };
};

export default usePolicyImport;
