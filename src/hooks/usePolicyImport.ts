
import { useState, useCallback } from 'react';
import { Policy } from '@/types/policies';
import { useAuthStore } from '@/stores/authStore';
import { parseCsv } from '@/utils/policies/policyImportUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

// To handle validation errors by row
interface ValidationErrors {
  [key: number]: string[];
}

export const usePolicyImport = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [importedPolicies, setImportedPolicies] = useState<Partial<Policy>[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isImporting, setIsImporting] = useState(false);
  const { user, companyId } = useAuthStore();
  
  const handleFileSelect = async (file: File) => {
    if (!file || !companyId) return;
    
    setIsImporting(true);
    
    try {
      const { policies, errors } = await parseCsv(file);
      
      if (errors && Object.keys(errors).length > 0) {
        setValidationErrors(errors);
      }
      
      // Map the parsed data to Policy objects
      const mappedPolicies = policies.map(item => ({
        policy_number: item.policy_number,
        policy_type: item.policy_type || 'standard',
        insurer_id: item.insurer_id || null,
        insurer_name: item.insurer_name,
        product_id: item.product_id || null, // Use product_id consistently
        product_name: item.product_name || null,
        client_id: item.client_id || null,
        policyholder_name: item.policyholder_name,
        insured_id: item.insured_id || null,
        insured_name: item.insured_name || item.policyholder_name,
        start_date: item.start_date,
        expiry_date: item.expiry_date,
        premium: parseFloat(item.premium || '0'),
        currency: item.currency || 'EUR',
        payment_frequency: item.payment_frequency || null,
        commission_type: item.commission_type || 'manual',
        commission_percentage: item.commission_percentage ? parseFloat(item.commission_percentage) : null,
        commission_amount: null, // Will be calculated later
        status: 'active',
        workflow_status: 'in_review',
        notes: item.notes || null,
        company_id: companyId,
        created_by: user?.id || null
      }));
      
      setImportedPolicies(mappedPolicies);
      
      toast({
        title: t('importProcessed'),
        description: t('policiesReadyForReview', { count: mappedPolicies.length })
      });
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast({
        title: t('importError'),
        description: typeof error === 'string' ? error : (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  const parseCSVFile = async (file: File) => {
    return handleFileSelect(file);
  };
  
  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  };
  
  const savePolicies = async () => {
    if (importedPolicies.length === 0) return false;
    
    setIsImporting(true);
    
    try {
      // Filter out policies with validation errors
      const validPolicies = importedPolicies.filter((_, index) => 
        !validationErrors[index] || validationErrors[index].length === 0
      );
      
      if (validPolicies.length === 0) {
        toast({
          title: t('noValidPolicies'),
          description: t('pleaseFixValidationErrors'),
          variant: 'destructive'
        });
        return false;
      }
      
      // Calculate commission amount for policies with percentage
      const policiesWithCommissions = validPolicies.map(policy => {
        let commissionAmount = null;
        if (policy.commission_percentage && policy.premium) {
          commissionAmount = (policy.premium * policy.commission_percentage) / 100;
        }
        return {
          ...policy,
          commission_amount: commissionAmount
        };
      });
      
      // Save policies to database
      const { data, error } = await supabase
        .from('policies')
        .insert(policiesWithCommissions);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: t('importSuccess'),
        description: t('policiesSuccessfullyImported', { count: validPolicies.length })
      });
      
      // Clear the imported data
      setImportedPolicies([]);
      setValidationErrors({});
      
      return true;
    } catch (error) {
      console.error('Error saving policies:', error);
      toast({
        title: t('importError'),
        description: typeof error === 'string' ? error : (error as Error).message,
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
  
  const downloadTemplate = () => {
    // Generate a template CSV for policy import
    const headers = [
      'policy_number', 'policy_type', 'insurer_name', 'product_name', 'product_id',
      'policyholder_name', 'insured_name', 'start_date', 'expiry_date',
      'premium', 'currency', 'payment_frequency', 'commission_type', 
      'commission_percentage', 'notes'
    ];
    
    const csvContent = [
      headers.join(','),
      'POL-12345,standard,Example Insurance Co,Car Insurance,PROD-001,John Doe,John Doe,2023-01-01,2024-01-01,1000,EUR,annual,manual,10,Example policy',
      'POL-67890,special,Another Insurer,Home Insurance,PROD-002,Jane Smith,Jane Smith,2023-02-15,2024-02-15,1500,USD,monthly,automatic,12,Second example'
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'policy_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    parseCSVFile,
    invalidPolicies: Object.keys(validationErrors).map(k => parseInt(k))
  };
};
