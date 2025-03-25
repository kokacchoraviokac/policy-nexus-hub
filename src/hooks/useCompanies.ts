
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Company {
  id: string;
  name: string;
  seatsLimit?: number;
  usedSeats?: number;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, seats_limit, used_seats')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      setCompanies(data?.map(company => ({
        id: company.id,
        name: company.name,
        seatsLimit: company.seats_limit,
        usedSeats: company.used_seats
      })) || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (name: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name }])
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      // Refresh the companies list
      fetchCompanies();
      return data.id;
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Failed to create company");
      return null;
    }
  };

  const updateCompanySeats = async (companyId: string, seatsLimit: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ seats_limit: seatsLimit })
        .eq('id', companyId);

      if (error) {
        throw error;
      }

      // Refresh the companies list
      fetchCompanies();
      toast.success("Company seats updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating company seats:", error);
      toast.error("Failed to update company seats");
      return false;
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return { 
    companies, 
    loading, 
    createCompany, 
    updateCompanySeats, 
    refreshCompanies: fetchCompanies 
  };
};
