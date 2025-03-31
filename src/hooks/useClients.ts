
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthContext } from "@/contexts/auth/AuthContext";

export interface Client {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  registration_number?: string;
  is_active: boolean;
}

export const useClients = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);

  const companyId = user?.companyId;

  const fetchClients = async () => {
    if (!companyId) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", companyId)
        .eq("is_active", true)
        .order("name");

      if (error) {
        throw error;
      }

      return data as Client[];
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: t("errorFetchingClients"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["clients", companyId],
    queryFn: fetchClients,
    enabled: !!companyId,
  });

  return {
    clients: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
