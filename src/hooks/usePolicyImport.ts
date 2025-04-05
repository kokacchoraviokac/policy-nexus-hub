
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Policy, ValidationErrors, PolicyStatus, WorkflowStatus } from "@/types/policies";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/utils/dateUtils";

export const usePolicyImport = () => {
  const [importedPolicies, setImportedPolicies] = useState<Partial<Policy>[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFileSelect = async (file: File) => {
    setIsImporting(true);
    
    try {
      // Read file as text
      const fileContent = await readFileAsText(file);
      let policies: Partial<Policy>[] = [];
      
      // Determine file type by extension and parse accordingly
      if (file.name.endsWith('.csv')) {
        policies = parseCSV(fileContent);
      } else if (file.name.endsWith('.json')) {
        policies = parseJSON(fileContent);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        toast({
          title: t("unsupportedFormat"),
          description: t("excelFormatNotSupported"),
          variant: "destructive",
        });
        setIsImporting(false);
        return;
      } else {
        toast({
          title: t("unsupportedFormat"),
          description: t("supportedFormatsMessage"),
          variant: "destructive",
        });
        setIsImporting(false);
        return;
      }
      
      // Add default values to policies
      policies = policies.map(policy => ({
        ...policy,
        status: (policy.status as PolicyStatus) || 'active',
        workflow_status: (policy.workflow_status as WorkflowStatus) || 'imported',
        created_at: formatDate(new Date()) || new Date().toISOString(),
        updated_at: formatDate(new Date()) || new Date().toISOString()
      }));
      
      // Validate policies
      const errors = validatePolicies(policies);
      
      setImportedPolicies(policies);
      setValidationErrors(errors);
      
      if (Object.keys(errors).length > 0) {
        toast({
          title: t("importWithErrors"),
          description: t("importWithErrorsMessage", { count: Object.keys(errors).length }),
          variant: "warning",
        });
      } else {
        toast({
          title: t("importSuccess"),
          description: t("policiesReadyForImport", { count: policies.length }),
        });
      }
    } catch (error) {
      console.error("Error processing import file:", error);
      toast({
        title: t("importError"),
        description: t("importErrorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  // Helper to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  
  // Parse CSV to policy objects
  const parseCSV = (content: string): Partial<Policy>[] => {
    const lines = content.split('\n');
    if (lines.length <= 1) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const policies: Partial<Policy>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const policy: Partial<Policy> = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        if (value === undefined) return;
        
        // Map CSV headers to policy properties
        switch (header.toLowerCase()) {
          case 'policy number':
          case 'policynumber':
            policy.policy_number = value;
            break;
          case 'policyholder':
          case 'policyholder name':
            policy.policyholder_name = value;
            break;
          case 'insurer':
          case 'insurer name':
            policy.insurer_name = value;
            break;
          case 'start date':
          case 'startdate':
            policy.start_date = value;
            break;
          case 'expiry date':
          case 'expirydate':
            policy.expiry_date = value;
            break;
          case 'premium':
            policy.premium = parseFloat(value);
            break;
          case 'currency':
            policy.currency = value;
            break;
          case 'status':
            policy.status = value;
            break;
          default:
            // Handle other fields based on your Policy interface
            (policy as any)[header] = value;
        }
      });
      
      policies.push(policy);
    }
    
    return policies;
  };
  
  // Parse JSON to policy objects
  const parseJSON = (content: string): Partial<Policy>[] => {
    try {
      const data = JSON.parse(content);
      
      // Handle array of policies
      if (Array.isArray(data)) {
        return data as Partial<Policy>[];
      }
      
      // Handle single policy object
      if (typeof data === 'object' && data !== null) {
        return [data as Partial<Policy>];
      }
      
      return [];
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid JSON format");
    }
  };
  
  // Validate policies
  const validatePolicies = (policies: Partial<Policy>[]): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    policies.forEach((policy, index) => {
      const policyErrors: string[] = [];
      
      // Required fields
      if (!policy.policy_number) {
        policyErrors.push("Policy number is required");
      }
      
      if (!policy.policyholder_name) {
        policyErrors.push("Policyholder name is required");
      }
      
      if (!policy.insurer_name) {
        policyErrors.push("Insurer name is required");
      }
      
      if (!policy.start_date) {
        policyErrors.push("Start date is required");
      }
      
      if (!policy.expiry_date) {
        policyErrors.push("Expiry date is required");
      }
      
      if (!policy.premium && policy.premium !== 0) {
        policyErrors.push("Premium is required");
      }
      
      // Add the errors if any
      if (policyErrors.length > 0) {
        errors[index] = policyErrors;
      }
    });
    
    return errors;
  };
  
  // Save policies to database
  const savePolicies = async (): Promise<boolean> => {
    setIsImporting(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: t("authError"),
          description: t("notLoggedIn"),
          variant: "destructive",
        });
        return false;
      }
      
      // Get user's company ID from metadata
      const companyId = user.user_metadata.company_id;
      
      if (!companyId) {
        toast({
          title: t("missingCompanyId"),
          description: t("contactAdmin"),
          variant: "destructive",
        });
        return false;
      }
      
      // Add company_id to each policy
      const policiesToSave = importedPolicies.map(policy => ({
        ...policy,
        company_id: companyId,
        created_by: user.id
      }));
      
      // Insert policies into the database
      const { data, error } = await supabase
        .from('policies')
        .insert(policiesToSave)
        .select();
      
      if (error) {
        console.error("Error saving policies:", error);
        toast({
          title: t("saveFailed"),
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: t("importSuccessful"),
        description: t("policiesImported", { count: data.length }),
      });
      
      // Clear imported data
      setImportedPolicies([]);
      setValidationErrors({});
      
      return true;
    } catch (error) {
      console.error("Error saving policies:", error);
      toast({
        title: t("saveFailed"),
        description: t("unexpectedError"),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };
  
  // Handle file drop
  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    handleFileSelect(acceptedFiles[0]);
  };
  
  // Clear imported data
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
    savePolicies,
    clearImportData
  };
};
