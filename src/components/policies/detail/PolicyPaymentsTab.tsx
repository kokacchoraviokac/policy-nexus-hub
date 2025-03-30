
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { UnlinkedPaymentType } from "@/types/policies";
import PolicyPaymentSummary from "./payment/PolicyPaymentSummary";
import PolicyPaymentHistory from "./payment/PolicyPaymentHistory";
import PolicyPaymentsLoading from "./payment/PolicyPaymentsLoading";

interface PolicyPaymentsTabProps {
  policyId: string;
}

const PolicyPaymentsTab: React.FC<PolicyPaymentsTabProps> = ({ policyId }) => {
  const { t } = useLanguage();

  const { data: policyData, isLoading: policyLoading } = useQuery({
    queryKey: ['policy-details', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policies')
        .select('premium, currency')
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: paymentsData, isLoading: paymentsLoading, refetch } = useQuery({
    queryKey: ['policy-payments', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unlinked_payments')
        .select('*')
        .eq('linked_policy_id', policyId)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      return data as UnlinkedPaymentType[];
    },
  });

  const isLoading = policyLoading || paymentsLoading;
  
  if (isLoading) {
    return <PolicyPaymentsLoading />;
  }

  const totalPaid = paymentsData?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const premium = policyData?.premium || 0;

  const handleExportPayments = () => {
    if (!paymentsData || paymentsData.length === 0) return;
    
    const csvContent = [
      ["Payment Date", "Reference", "Payer Name", "Amount", "Currency"].join(","),
      ...paymentsData.map(payment => [
        payment.payment_date,
        payment.reference || "",
        payment.payer_name || "",
        payment.amount,
        payment.currency
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `policy-payments-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("policyPayments")}</h2>
        <Button onClick={() => refetch()} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("refresh")}
        </Button>
      </div>

      <PolicyPaymentSummary 
        premium={premium} 
        currency={policyData?.currency} 
        totalPaid={totalPaid} 
      />

      <PolicyPaymentHistory 
        paymentsData={paymentsData || []} 
        policyId={policyId}
        premium={premium}
        currency={policyData?.currency}
        onExportPayments={handleExportPayments}
      />
    </div>
  );
};

export default PolicyPaymentsTab;
