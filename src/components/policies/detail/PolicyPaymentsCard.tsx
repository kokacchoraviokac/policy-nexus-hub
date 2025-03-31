
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { CircleDollarSign, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PolicyPaymentsCardProps {
  policyId: string;
}

const PolicyPaymentsCard: React.FC<PolicyPaymentsCardProps> = ({
  policyId,
}) => {
  const { t, formatCurrency } = useLanguage();
  
  // Fetch policy info for premium and currency
  const { data: policyBasic } = useQuery({
    queryKey: ['policy-payment-info', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policies')
        .select('premium, currency')
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!policyId
  });

  // Fetch payments for this policy
  const { data: payments } = useQuery({
    queryKey: ['policy-payments', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unlinked_payments')
        .select('*')
        .eq('linked_policy_id', policyId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!policyId
  });

  const handleViewPayments = () => {
    const paymentsTab = document.querySelector('[data-value="payments"]');
    if (paymentsTab instanceof HTMLElement) {
      paymentsTab.click();
    }
  };

  const handleAddPayment = () => {
    // This would redirect to the payments page with this policy pre-selected
    window.location.href = `/policies/unlinked-payments?policyId=${policyId}`;
  };

  const totalPaid = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const premium = policyBasic?.premium || 0;
  const currency = policyBasic?.currency || 'EUR';
  
  const paymentPercentage = premium > 0 ? Math.min(100, (totalPaid / premium) * 100) : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start mb-4">
          <CircleDollarSign className="h-5 w-5 text-muted-foreground mr-2" />
          <h3 className="font-semibold">{t("payments")}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("premium")}</span>
            <span className="font-medium">{formatCurrency(premium, currency)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("totalPaid")}</span>
            <span className="font-medium">{formatCurrency(totalPaid, currency)}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("paymentProgress")}</span>
              <span>{Math.round(paymentPercentage)}%</span>
            </div>
            <Progress value={paymentPercentage} className="h-2" />
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleViewPayments}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {t("viewPayments")}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={handleAddPayment}
            >
              {t("recordPayment")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyPaymentsCard;
