
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Company {
  id: string;
  name: string;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      setCompanies(data || []);
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  return { companies, loading, createCompany, refreshCompanies: fetchCompanies };
};
