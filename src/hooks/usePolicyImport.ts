
import { useState, useEffect } from "react";
import { Policy } from "@/types/policies";
import { parsePolicyCSV, validateImportedPolicies } from "@/utils/policies/importUtils";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";

export const usePolicyImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importedPolicies, setImportedPolicies] = useState<Partial<Policy>[]>([]);
  const [invalidPolicies, setInvalidPolicies] = useState<{ policy: Partial<Policy>; errors: string[] }[]>([]);
  const [salesProcessData, setSalesProcessData] = useState<any>(null);
  const supabase = useSupabaseClient();
  const location = useLocation();

  // Check for sales process ID in URL params
  useEffect(() => {
    const fetchSalesProcessData = async (salesId: string) => {
      try {
        setIsImporting(true);
        // In a real app, this would fetch the sales process data from the API
        console.log("Fetching sales process data for ID:", salesId);
        
        // Simulate an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For demo purposes, we'll create a mock policy based on the sales process
        const mockPolicyFromSales: Partial<Policy> = {
          policy_number: `POL-${salesId.substring(0, 5)}`,
          policy_type: "Standard",
          insurer_name: "Example Insurance Company",
          product_name: "Business Insurance",
          product_code: "BI-001",
          policyholder_name: "Sales Client",
          insured_name: "Sales Client",
          start_date: new Date().toISOString().split('T')[0],
          expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          premium: 1000,
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
          policy: mockPolicyFromSales
        });
        
        setImportedPolicies([mockPolicyFromSales]);
        
        toast.success("Sales process data loaded successfully", {
          description: "Ready to import policy from sales process"
        });
      } catch (error: any) {
        console.error("Error fetching sales process data:", error);
        toast.error(`Error loading sales process data: ${error.message}`);
      } finally {
        setIsImporting(false);
      }
    };
    
    const queryParams = new URLSearchParams(location.search);
    const salesProcessId = queryParams.get("from_sales");
    
    if (salesProcessId) {
      fetchSalesProcessData(salesProcessId);
    }
  }, [location]);

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
      // Get the user's data to get company_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User authentication required");
        return false;
      }
      
      // Get the user's profile to get company_id
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .single();
      
      if (!userProfile?.company_id) {
        toast.error("Company ID not found");
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
          // In a real application, you might want to add a proper reference in a dedicated field
        }

        return policyData;
      });
      
      // Insert policies into database one by one to avoid batch issues
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
            // In a real application, this would update the sales process to show a policy was created
            console.log(`Updating sales process ${salesProcessData.id} status to link it with policy ${policy.id}`);
            
            // This would be the real implementation to update the sales process
            // const { error: updateError } = await supabase
            //   .from("sales_processes")
            //   .update({ policy_id: policy.id, status: "converted" })
            //   .eq("id", salesProcessData.id);
            
            // if (updateError) {
            //   console.error("Error updating sales process:", updateError);
            // }
          }
        }
      }
      
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} policies.`);
        
        if (errorCount > 0) {
          toast.error(`Failed to import ${errorCount} policies due to database errors.`);
          console.error("Import errors:", errors);
        }
        
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
