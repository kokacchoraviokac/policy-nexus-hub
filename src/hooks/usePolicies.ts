
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthContext } from "@/contexts/auth/AuthContext";

export interface Policy {
  id: string;
  policy_number: string;
  policyholder_name: string;
  insured_name?: string;
  insurer_name: string;
  product_name?: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  status: string;
  workflow_status: string;
  commission_percentage?: number;
  commission_amount?: number;
}

export const usePolicies = (options?: {
  pageIndex?: number;
  pageSize?: number;
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);

  const companyId = user?.companyId;
  const pageIndex = options?.pageIndex || 0;
  const pageSize = options?.pageSize || 10;

  const fetchPolicies = async () => {
    if (!companyId) {
      return [];
    }

    try {
      const from = pageIndex * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from("policies")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      return data as Policy[];
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast({
        title: t("errorFetchingPolicies"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["policies", companyId, pageIndex, pageSize],
    queryFn: fetchPolicies,
    enabled: !!companyId,
  });

  return {
    policies: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
