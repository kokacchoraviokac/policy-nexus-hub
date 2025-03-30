
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Policy } from "@/types/policies";
import { CircleDollarSign, Calculator } from "lucide-react";
import { useCommissionMutations } from "@/hooks/commissions/useCommissionMutations";
import CalculateCommissionDialog from "@/components/finances/commissions/CalculateCommissionDialog";

interface PolicyFinancialsTabProps {
  policyId: string;
}

const PolicyFinancialsTab: React.FC<PolicyFinancialsTabProps> = ({ policyId }) => {
  const { t, formatCurrency } = useLanguage();
  const [showCalculateDialog, setShowCalculateDialog] = useState(false);
  const { calculateCommission, isCalculating } = useCommissionMutations();

  const { data: policyData, isLoading } = useQuery({
    queryKey: ['policy-details', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      return data as Policy;
    },
  });

  const { data: commissions, isLoading: isLoadingCommissions } = useQuery({
    queryKey: ['policy-commissions', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commissions')
        .select('*')
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("policyNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("financialInformation")}</h2>
        <Button 
          onClick={() => setShowCalculateDialog(true)}
          className="gap-2"
        >
          <Calculator className="h-4 w-4" />
          {t("calculateCommission")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("premiumInformation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("totalPremium")}</p>
                  <p className="text-xl font-semibold mt-1">
                    {formatCurrency(policyData.premium, policyData.currency)}
                  </p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <CircleDollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
              
              {policyData.payment_frequency && (
                <div>
                  <p className="text-sm text-muted-foreground">{t("paymentFrequency")}</p>
                  <p className="font-medium">{t(policyData.payment_frequency)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("commissionInformation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {policyData.commission_percentage ? (
                <div>
                  <p className="text-sm text-muted-foreground">{t("commissionRate")}</p>
                  <p className="font-medium">{policyData.commission_percentage}%</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">{t("noCommissionDefined")}</p>
              )}
              
              {policyData.commission_amount ? (
                <div>
                  <p className="text-sm text-muted-foreground">{t("commissionAmount")}</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(policyData.commission_amount, policyData.currency)}
                  </p>
                </div>
              ) : null}
              
              {commissions && commissions.length > 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t("calculatedCommissions")}</p>
                  <div className="space-y-2">
                    {commissions.map((commission) => (
                      <div key={commission.id} className="p-2 border rounded-md bg-muted/10">
                        <div className="flex justify-between">
                          <span>{formatCurrency(commission.calculated_amount, policyData.currency)}</span>
                          <span className="text-sm">{new Date(commission.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("baseAmount")}: {formatCurrency(commission.base_amount, policyData.currency)} | 
                          {t("rate")}: {commission.rate}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {showCalculateDialog && (
        <CalculateCommissionDialog 
          open={showCalculateDialog}
          onOpenChange={setShowCalculateDialog}
          policy={policyData}
          onCalculate={calculateCommission}
          isCalculating={isCalculating}
        />
      )}
    </div>
  );
};

export default PolicyFinancialsTab;
