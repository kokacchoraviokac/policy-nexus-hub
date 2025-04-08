
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { usePolicyAddendums } from "@/hooks/usePolicyAddendums";
import AddendumList from "../addendums/AddendumList";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddendumFormDialog from "../addendums/AddendumFormDialog";

interface PolicyAddendumTabProps {
  policyId: string;
}

const PolicyAddendumTab: React.FC<PolicyAddendumTabProps> = ({ policyId }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showAddendumForm, setShowAddendumForm] = useState(false);
  
  // Fetch policy details to get the policy number
  const { data: policy, isLoading: policyLoading } = useQuery({
    queryKey: ['policy-details-for-addendum', policyId],
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
  
  const { 
    addendums, 
    isLoading, 
    isError, 
    refetch 
  } = usePolicyAddendums(policyId);
  
  const handleCreateAddendum = () => {
    setShowAddendumForm(true);
  };
  
  const handleAddendumSuccess = () => {
    setShowAddendumForm(false);
    refetch();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{t("policyAddenda")}</CardTitle>
        <Button 
          size="sm" 
          onClick={handleCreateAddendum}
          disabled={isLoading || policyLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("addAddendum")}
        </Button>
      </CardHeader>
      <CardContent>
        {policyLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <AddendumList 
            addendums={addendums || []}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            policyId={policyId}
          />
        )}
        
        {showAddendumForm && policy && (
          <AddendumFormDialog
            policyId={policyId}
            policyNumber={policy.policy_number}
            open={showAddendumForm}
            onClose={() => setShowAddendumForm(false)}
            onSuccess={handleAddendumSuccess}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyAddendumTab;
