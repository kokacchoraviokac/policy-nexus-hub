
import { useQuery } from "@tanstack/react-query";
import { Insurer } from "@/types/codebook";
import { supabase } from "@/integrations/supabase/client";

export function useInsurer(insurerId?: string) {
  const {
    data: insurer,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["insurer", insurerId],
    queryFn: async () => {
      if (!insurerId) return null;
      
      const { data, error } = await supabase
        .from("insurers")
        .select("*")
        .eq("id", insurerId)
        .single();
      
      if (error) throw error;
      return data as Insurer;
    },
    enabled: !!insurerId,
  });

  return {
    insurer,
    isLoading,
    isError,
    error,
  };
}
