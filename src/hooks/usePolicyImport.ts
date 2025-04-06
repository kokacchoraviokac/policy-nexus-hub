
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { InvalidPolicy, Policy, ValidationErrors, WorkflowStatus, PolicyStatus } from "@/types/policies";
import PolicyService from "@/services/PolicyService";
import { useAuth } from "@/contexts/AuthContext";
import Papa from "papaparse";

export function usePolicyImport() {
  const [importedPolicies, setImportedPolicies] = useState<Partial<Policy>[]>([]);
  const [invalidPolicies, setInvalidPolicies] = useState<InvalidPolicy[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = async (file: File): Promise<void> => {
    if (!file) {
      toast({
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }

    if (!file.name.endsWith(".csv")) {
      toast({
        description: "Only CSV files are supported",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setImportedPolicies([]);
    setInvalidPolicies([]);
    setValidationErrors({});

    try {
      const text = await file.text();

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          try {
            if (result.errors.length > 0) {
              toast({
                description: `CSV parsing error: ${result.errors[0].message}`,
                variant: "destructive",
              });
              setValidationErrors({
                general: [`CSV parsing error: ${result.errors[0].message}`]
              });
              return;
            }

            const mapped = transformCSVToPolicy(result.data);
            validatePolicies(mapped);
          } catch (error: any) {
            console.error("Error processing CSV:", error);
            toast({
              description: `Error processing file: ${error.message}`,
              variant: "destructive",
            });
            setValidationErrors({
              general: [`Error processing file: ${error.message}`]
            });
          } finally {
            setIsProcessing(false);
          }
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          toast({
            description: `Error parsing CSV: ${error.message}`,
            variant: "destructive",
          });
          setValidationErrors({
            general: [`Error parsing CSV: ${error.message}`]
          });
          setIsProcessing(false);
        },
      });
    } catch (error: any) {
      console.error("File reading error:", error);
      toast({
        description: `Error reading file: ${error.message}`,
        variant: "destructive",
      });
      setValidationErrors({
        general: [`Error reading file: ${error.message}`]
      });
      setIsProcessing(false);
    }
  };

  const handleFileDrop = async (acceptedFiles: File[]): Promise<void> => {
    if (acceptedFiles.length === 0) {
      toast({
        description: "No file was dropped",
        variant: "destructive",
      });
      return;
    }

    await handleFileSelect(acceptedFiles[0]);
  };

  const validatePolicies = (policies: Partial<Policy>[]) => {
    const errors: ValidationErrors = {};
    const valid: Partial<Policy>[] = [];
    const invalid: InvalidPolicy[] = [];

    for (let i = 0; i < policies.length; i++) {
      const policy = policies[i];
      const rowErrors: string[] = [];

      // Required fields validation
      if (!policy.policy_number) rowErrors.push("Policy number is required");
      if (!policy.policyholder_name) rowErrors.push("Policyholder name is required");
      if (!policy.insurer_name) rowErrors.push("Insurer name is required");
      if (!policy.start_date) rowErrors.push("Start date is required");
      if (!policy.expiry_date) rowErrors.push("Expiry date is required");
      if (!policy.premium) rowErrors.push("Premium is required");

      // If there are errors, add to invalid policies
      if (rowErrors.length > 0) {
        invalid.push({
          row: i + 2, // +2 for header row and 0-index
          data: policy,
          errors: rowErrors
        });
      } else {
        valid.push(policy);
      }
    }

    if (invalid.length > 0) {
      errors.policies = invalid;
    }

    setValidationErrors(errors);
    setImportedPolicies(valid);
    setInvalidPolicies(invalid);

    if (valid.length > 0) {
      toast({
        description: `Found ${valid.length} valid policies to import`,
      });
    }

    if (invalid.length > 0) {
      toast({
        description: `Found ${invalid.length} policies with validation errors`,
        variant: "destructive",
      });
    }
  };

  const transformCSVToPolicy = (data: any[]): Partial<Policy>[] => {
    if (data.length === 0) {
      throw new Error("CSV file is empty");
    }

    return data.map((row, index) => {
      const policy: Partial<Policy> = {
        policy_number: row.policy_number || row["Policy Number"] || "",
        policy_type: row.policy_type || row["Policy Type"] || "standard",
        policyholder_name: row.policyholder_name || row["Policyholder Name"] || "",
        insurer_name: row.insurer_name || row["Insurer"] || "",
        start_date: row.start_date || row["Start Date"] || "",
        expiry_date: row.expiry_date || row["Expiry Date"] || "",
        premium: parseFloat(row.premium || row["Premium"] || 0),
        currency: row.currency || row["Currency"] || "EUR",
        status: PolicyStatus.ACTIVE,
        workflow_status: WorkflowStatus.DRAFT,
      };

      if (row.commission_percentage || row["Commission %"]) {
        policy.commission_percentage = parseFloat(row.commission_percentage || row["Commission %"]);
      }

      if (row.commission_amount || row["Commission Amount"]) {
        policy.commission_amount = parseFloat(row.commission_amount || row["Commission Amount"]);
      }

      return policy;
    });
  };

  const submitPolicies = async (): Promise<void> => {
    if (importedPolicies.length === 0) {
      toast({
        description: "No valid policies to import",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await PolicyService.importPolicies(importedPolicies, user?.id || "");

      toast({
        description: `Successfully imported ${result.success.length} policies`,
      });

      // Clear state after successful import
      setImportedPolicies([]);
      setInvalidPolicies([]);
      setValidationErrors({});
    } catch (error: any) {
      console.error("Error importing policies:", error);
      toast({
        description: `Error importing policies: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    importedPolicies,
    invalidPolicies,
    validationErrors,
    handleFileSelect,
    handleFileDrop,
    isProcessing,
    isSubmitting,
    submitPolicies,
  };
}
