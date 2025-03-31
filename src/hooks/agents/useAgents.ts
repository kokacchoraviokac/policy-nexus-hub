
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  tax_id: string;
  bank_account: string;
}

export const useAgents = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);

  const companyId = user?.companyId;

  const fetchAgents = async () => {
    if (!companyId) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("company_id", companyId)
        .eq("status", "active")
        .order("name");

      if (error) {
        throw error;
      }

      return data as Agent[];
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast({
        title: t("errorFetchingAgents"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["agents", companyId],
    queryFn: fetchAgents,
  });

  return {
    agents: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
