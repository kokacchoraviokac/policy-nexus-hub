
import { useState, useEffect } from "react";
import { Policy } from "@/types/policies";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
import Papa from "papaparse";

interface ImportedPolicy {
  policy_number: string;
  policy_type?: string;
  insurer_name: string;
  product_name?: string;
  product_code?: string;
  policyholder_name: string;
  insured_name?: string;
  start_date: string;
  expiry_date: string;
  premium: number | string;
  currency: string;
  payment_frequency?: string;
  commission_percentage?: number | string;
  commission_type?: string;
  notes?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

export const usePolicyImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importedPolicies, setImportedPolicies] = useState<Partial<Policy>[]>([]);
  const [invalidPolicies, setInvalidPolicies] = useState<{ policy: Partial<Policy>; errors: ValidationError[] }[]>([]);
  const [salesProcessData, setSalesProcessData] = useState<any>(null);
  const { toast } = useToast();
  const location = useLocation();

  // Check for sales process ID in URL params
  useEffect(() => {
    const fetchSalesProcessData = async (salesId: string) => {
      try {
        setIsImporting(true);
        
        const { data, error } = await supabase
          .from("sales_processes")
          .select(`
            id,
            sales_number,
            lead_id,
            leads:lead_id (
              name,
              company_name,
              contact_person,
              email,
              phone
            ),
            current_step,
            status,
            estimated_value
          `)
          .eq("id", salesId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Create a mock policy based on sales process data
          const mockPolicyFromSales: Partial<Policy> = {
            policy_number: `POL-${data.sales_number || salesId.substring(0, 6)}`,
            policy_type: "Standard",
            insurer_name: "Insurance Company", // This would be selected by the user
            product_name: "Insurance Product", // This would be selected by the user
            policyholder_name: data.leads?.company_name || data.leads?.name || "Client from Sales Process",
            insured_name: data.leads?.company_name || data.leads?.name || "Client from Sales Process",
            start_date: new Date().toISOString().split('T')[0],
            expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            premium: data.estimated_value || 1000,
            currency: "EUR",
            payment_frequency: "annual",
            commission_type: "automatic",
            commission_percentage: 10,
            notes: `Imported from sales process ${salesId}`,
            workflow_status: "draft",
            status: "active"
          };
          
          setSalesProcessData({
            id: salesId,
            policy: mockPolicyFromSales,
            salesProcess: data
          });
          
          setImportedPolicies([mockPolicyFromSales]);
          
          toast({
            title: "Sales process data loaded",
            description: "Ready to import policy from sales process"
          });
        }
      } catch (error: any) {
        console.error("Error fetching sales process data:", error);
        toast({
          title: "Error loading sales process data",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsImporting(false);
      }
    };
    
    const queryParams = new URLSearchParams(location.search);
    const salesProcessId = queryParams.get("from_sales");
    
    if (salesProcessId) {
      fetchSalesProcessData(salesProcessId);
    }
  }, [location, toast]);

  const parseCSVFile = async (file: File): Promise<void> => {
    setIsImporting(true);
    
    try {
      const text = await file.text();
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length === 0) {
            toast({
              title: "No data found",
              description: "The uploaded file contains no valid data rows",
              variant: "destructive"
            });
            setIsImporting(false);
            return;
          }
          
          const parsedPolicies = results.data as ImportedPolicy[];
          const { valid, invalid } = validateImportedPolicies(parsedPolicies);
          
          setImportedPolicies(valid);
          setInvalidPolicies(invalid);
          
          if (invalid.length > 0) {
            toast({
              title: `${invalid.length} policies have validation issues`,
              description: "Please review the errors before importing"
            });
          }
          
          if (valid.length > 0) {
            toast({
              title: `Successfully parsed ${valid.length} policies`,
              description: "Review the policies before importing"
            });
          } else {
            toast({
              title: "No valid policies found",
              description: "Check the file format and try again",
              variant: "destructive"
            });
          }
          
          setIsImporting(false);
        },
        error: (error) => {
          console.error("CSV Parse Error:", error);
          toast({
            title: "Error parsing CSV",
            description: error.message,
            variant: "destructive"
          });
          setIsImporting(false);
        }
      });
    } catch (error: any) {
      console.error("Error parsing CSV:", error);
      toast({
        title: "Error parsing file",
        description: error.message,
        variant: "destructive"
      });
      setIsImporting(false);
    }
  };

  const validateImportedPolicies = (policies: ImportedPolicy[]) => {
    const valid: Partial<Policy>[] = [];
    const invalid: { policy: Partial<Policy>; errors: ValidationError[] }[] = [];
    
    policies.forEach((policy) => {
      const errors: ValidationError[] = [];
      
      // Validate required fields
      if (!policy.policy_number) errors.push({ field: 'policy_number', message: 'Policy number is required' });
      if (!policy.insurer_name) errors.push({ field: 'insurer_name', message: 'Insurer name is required' });
      if (!policy.policyholder_name) errors.push({ field: 'policyholder_name', message: 'Policyholder name is required' });
      if (!policy.start_date) errors.push({ field: 'start_date', message: 'Start date is required' });
      if (!policy.expiry_date) errors.push({ field: 'expiry_date', message: 'Expiry date is required' });
      if (!policy.premium) errors.push({ field: 'premium', message: 'Premium amount is required' });
      if (!policy.currency) errors.push({ field: 'currency', message: 'Currency is required' });
      
      // Validate date formats
      if (policy.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(policy.start_date)) {
        errors.push({ field: 'start_date', message: 'Invalid date format (YYYY-MM-DD)' });
      }
      
      if (policy.expiry_date && !/^\d{4}-\d{2}-\d{2}$/.test(policy.expiry_date)) {
        errors.push({ field: 'expiry_date', message: 'Invalid date format (YYYY-MM-DD)' });
      }
      
      // Validate numeric values
      if (policy.premium && isNaN(Number(policy.premium))) {
        errors.push({ field: 'premium', message: 'Premium must be a number' });
      }
      
      if (policy.commission_percentage && isNaN(Number(policy.commission_percentage))) {
        errors.push({ field: 'commission_percentage', message: 'Commission percentage must be a number' });
      }
      
      // Convert to Policy type for valid entries
      const policyData: Partial<Policy> = {
        ...policy,
        premium: policy.premium ? Number(policy.premium) : 0,
        commission_percentage: policy.commission_percentage ? Number(policy.commission_percentage) : undefined,
        workflow_status: 'draft',
        status: 'active'
      };
      
      if (errors.length === 0) {
        valid.push(policyData);
      } else {
        invalid.push({ policy: policyData, errors });
      }
    });
    
    return { valid, invalid };
  };

  const savePolicies = async (): Promise<boolean> => {
    if (importedPolicies.length === 0) {
      toast({
        title: "No valid policies to import",
        description: "Please upload a file with valid policy data",
        variant: "destructive"
      });
      return false;
    }
    
    setIsImporting(true);
    
    try {
      // Get the user's data to get company_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to import policies",
          variant: "destructive"
        });
        return false;
      }
      
      // Get the user's profile to get company_id
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .single();
      
      if (!userProfile?.company_id) {
        toast({
          title: "Company ID not found",
          description: "Your user profile is not associated with a company",
          variant: "destructive"
        });
        return false;
      }
      
      const companyId = userProfile.company_id;
      
      // Prepare policies with required fields for insertion
      const policiesToInsert = importedPolicies.map(policy => {
        const policyData = {
          id: uuidv4(),
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
          company_id: companyId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: user.id
        };

        // If we're importing from a sales process, add a reference to it
        if (salesProcessData?.id) {
          policyData.notes = `${policyData.notes || ''}\nImported from sales process ID: ${salesProcessData.id}`;
          
          // In a real application, we would also update the sales process status
          // to indicate that a policy has been created from it
        }

        return policyData;
      });
      
      // Insert policies into database
      let successCount = 0;
      let errorCount = 0;
      let errors: string[] = [];
      
      for (const policy of policiesToInsert) {
        const { data, error } = await supabase
          .from("policies")
          .insert(policy)
          .select();
        
        if (error) {
          console.error("Error saving policy:", error, policy);
          errors.push(`Error saving policy ${policy.policy_number}: ${error.message}`);
          errorCount++;
        } else {
          successCount++;
          
          // If we imported from a sales process, update the sales process status
          if (salesProcessData?.id && successCount > 0) {
            const { error: updateError } = await supabase
              .from("sales_processes")
              .update({ 
                status: "converted",
                current_step: "concluded"
              })
              .eq("id", salesProcessData.id);
            
            if (updateError) {
              console.error("Error updating sales process:", updateError);
            }
          }
        }
      }
      
      if (successCount > 0) {
        toast({
          title: "Import successful",
          description: `Successfully imported ${successCount} policies`,
        });
        
        if (errorCount > 0) {
          toast({
            title: `Failed to import ${errorCount} policies`,
            description: "See console for details",
            variant: "destructive"
          });
          console.error("Import errors:", errors);
        }
        
        return true;
      } else {
        toast({
          title: "Import failed",
          description: "Failed to import any policies",
          variant: "destructive"
        });
        return false;
      }
    } catch (error: any) {
      console.error("Error saving policies:", error);
      toast({
        title: "Error saving policies",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  const clearImportData = () => {
    setImportedPolicies([]);
    setInvalidPolicies([]);
    setSalesProcessData(null);
  };

  return {
    isImporting,
    importedPolicies,
    invalidPolicies,
    parseCSVFile,
    savePolicies,
    clearImportData,
    salesProcessData
  };
};
