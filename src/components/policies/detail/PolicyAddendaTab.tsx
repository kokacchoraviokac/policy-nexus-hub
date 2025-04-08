
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface PolicyAddendaTabProps {
  policyId: string;
}

const PolicyAddendaTab: React.FC<PolicyAddendaTabProps> = ({ policyId }) => {
  const { t } = useLanguage();
  
  // Fetch policy details to get the policy number
  const { data: policy } = useQuery({
    queryKey: ['policy-details', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policies')
        .select('policy_number')
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });
  
  // This is a placeholder component - will be implemented fully later
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("policyAddenda")}</CardTitle>
            <CardDescription>
              {policy?.policy_number 
                ? t("addendaForPolicy", { policyNumber: policy.policy_number }) 
                : t("policyAddendaDescription")}
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("addAddendum")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-6 text-muted-foreground">
          <p>{t("noAddendaForPolicy")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyAddendaTab;
