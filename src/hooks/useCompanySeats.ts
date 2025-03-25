
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/hooks/useCompanies";
import { CompanySeatsInfo } from "@/types/auth/signup";

export const useCompanySeats = (companies: Company[]) => {
  const [companySeatsInfo, setCompanySeatsInfo] = useState<Record<string, CompanySeatsInfo>>({});

  useEffect(() => {
    const fetchCompanySeatsInfo = async () => {
      const seatsInfo: Record<string, CompanySeatsInfo> = {};
      
      for (const company of companies) {
        const { data } = await supabase.rpc('company_has_available_seats', { 
          company_id: company.id 
        });
        
        seatsInfo[company.id] = {
          id: company.id,
          hasAvailableSeats: !!data,
          usedSeats: company.usedSeats || 0,
          seatsLimit: company.seatsLimit || 0
        };
      }
      
      setCompanySeatsInfo(seatsInfo);
    };
    
    if (companies.length > 0) {
      fetchCompanySeatsInfo();
    }
  }, [companies]);

  return companySeatsInfo;
};
