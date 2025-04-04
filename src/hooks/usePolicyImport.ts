
import { useState, useRef } from "react";
import * as XLSX from 'xlsx';
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { PolicyService } from "@/services/PolicyService";
import { v4 as uuidv4 } from "uuid";

export const usePolicyImport = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [importedPolicies, setImportedPolicies] = useState<Partial<Policy>[]>([]);
  const [validationErrors, setValidationErrors] = useState<{[key: number]: string[]}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate a single policy
  const validatePolicy = (policy: Partial<Policy>): string[] => {
    const errors: string[] = [];
    
    // Check required fields
    if (!policy.policy_number) errors.push(t("policyNumberRequired"));
    if (!policy.policyholder_name) errors.push(t("policyholderNameRequired"));
    if (!policy.insurer_name) errors.push(t("insurerNameRequired"));
    if (!policy.start_date) errors.push(t("startDateRequired"));
    if (!policy.expiry_date) errors.push(t("expiryDateRequired"));
    if (!policy.premium) errors.push(t("premiumRequired"));
    if (!policy.currency) errors.push(t("currencyRequired"));
    
    // Validate date formats
    if (policy.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(policy.start_date)) {
      errors.push(t("invalidStartDateFormat"));
    }
    
    if (policy.expiry_date && !/^\d{4}-\d{2}-\d{2}$/.test(policy.expiry_date)) {
      errors.push(t("invalidExpiryDateFormat"));
    }
    
    return errors;
  };
  
  // Parse Excel file
  const parseExcelFile = (file: File): Promise<Partial<Policy>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Transform to Policy objects
          const policies = jsonData.map((row: any) => {
            return {
              policy_number: row.policy_number,
              policy_type: row.policy_type || 'Standard',
              policyholder_name: row.policyholder_name,
              insurer_name: row.insurer_name,
              start_date: row.start_date,
              expiry_date: row.expiry_date,
              premium: parseFloat(row.premium),
              currency: row.currency,
              product_name: row.product_name,
              product_id: row.product_id, // Use product_id instead of product_code
              commission_percentage: row.commission_percentage ? parseFloat(row.commission_percentage) : undefined,
              commission_type: row.commission_type || 'automatic',
              workflow_status: 'draft',
              status: 'active',
              insured_name: row.insured_name || row.policyholder_name
            } as Partial<Policy>;
          });
          
          resolve(policies);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  };
  
  // Handle file selection
  const handleFileSelect = async (file: File) => {
    try {
      const policies = await parseExcelFile(file);
      
      // Validate each policy
      const errors: {[key: number]: string[]} = {};
      let hasErrors = false;
      
      policies.forEach((policy, index) => {
        const policyErrors = validatePolicy(policy);
        if (policyErrors.length > 0) {
          errors[index] = policyErrors;
          hasErrors = true;
        }
      });
      
      if (hasErrors) {
        setValidationErrors(errors);
        toast({
          title: t("validationErrors"),
          description: t("somePolicesHaveErrors"),
          variant: "destructive",
        });
      } else {
        setValidationErrors({});
      }
      
      setImportedPolicies(policies);
      
      toast({
        title: t("fileProcessed"),
        description: t("policiesReadFromFile", { count: policies.length }),
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: t("processingError"),
        description: t("errorProcessingFile"),
        variant: "destructive",
      });
    }
  };
  
  // Handle file drop
  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Import mutation
  const importMutation = useMutation({
    mutationFn: async (policies: Partial<Policy>[]) => {
      // Add temporary IDs to policies
      const policiesWithIds = policies.map(policy => ({
        ...policy,
        id: uuidv4()
      }));
      
      // Import each policy
      const results = await Promise.all(
        policiesWithIds.map(policy => PolicyService.createPolicy(policy))
      );
      
      // Check for errors
      const errors = results.filter(result => !result.success);
      if (errors.length > 0) {
        throw new Error(`Failed to import ${errors.length} policies`);
      }
      
      return results.length;
    },
    onSuccess: (count) => {
      toast({
        title: t("importSuccess"),
        description: t("policiesImportedSuccessfully", { count }),
      });
      
      // Reset state
      setImportedPolicies([]);
      setValidationErrors({});
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      toast({
        title: t("importError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  // Download sample template
  const downloadTemplate = () => {
    // Create sample data
    const sampleData = [
      {
        policy_number: 'POL-2023-001',
        policy_type: 'Standard',
        policyholder_name: 'John Doe',
        insured_name: 'John Doe',
        insurer_name: 'ABC Insurance',
        product_name: 'Auto Insurance',
        product_id: 'AUTO-001',
        start_date: '2023-01-01',
        expiry_date: '2024-01-01',
        premium: 1000,
        currency: 'EUR',
        commission_percentage: 10,
        commission_type: 'automatic'
      }
    ];
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Policies');
    
    // Generate excel file and trigger download
    XLSX.writeFile(workbook, 'policy_import_template.xlsx');
  };
  
  return {
    importedPolicies,
    validationErrors,
    handleFileSelect,
    handleFileDrop,
    triggerFileInput,
    fileInputRef,
    importPolicies: () => importMutation.mutate(importedPolicies),
    isImporting: importMutation.isPending,
    downloadTemplate
  };
};
