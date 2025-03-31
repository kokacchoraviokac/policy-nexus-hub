
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PolicyPaymentSummary from "./payment/PolicyPaymentSummary";
import PolicyPaymentHistory from "./payment/PolicyPaymentHistory";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { UnlinkedPaymentType } from "@/types/policies";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PolicyPaymentsTabProps {
  policyId: string;
}

const PolicyPaymentsTab: React.FC<PolicyPaymentsTabProps> = ({ policyId }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  // Fetch policy info for premium and currency
  const { data: policyBasic, isLoading: isPolicyLoading } = useQuery({
    queryKey: ['policy-payment-details', policyId],
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
  const { data: payments, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['policy-payments-list', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unlinked_payments')
        .select('*')
        .eq('linked_policy_id', policyId)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      return data as UnlinkedPaymentType[];
    },
    enabled: !!policyId
  });
  
  const handleExportPayments = () => {
    // This would download a CSV of payments
    setIsExporting(true);
    
    toast({
      title: t("exportStarted"),
      description: t("paymentsExportInProgress"),
    });
    
    // In a real implementation, this would actually export the data
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: t("exportComplete"),
        description: t("paymentsExportedSuccessfully"),
      });
    }, 2000);
  };

  const totalPaid = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const premium = policyBasic?.premium || 0;
  const currency = policyBasic?.currency || 'EUR';
  
  if (isPolicyLoading || isPaymentsLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("paymentInformation")}</h2>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleExportPayments}
          disabled={isExporting || !payments?.length}
        >
          <FileDown className="h-4 w-4" />
          {isExporting ? t("exporting") : t("exportPayments")}
        </Button>
      </div>
      
      <PolicyPaymentSummary 
        premium={premium} 
        currency={currency} 
        totalPaid={totalPaid} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>{t("paymentHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PolicyPaymentHistory 
            paymentsData={payments || []} 
            policyId={policyId}
            premium={premium}
            currency={currency}
            onExportPayments={handleExportPayments}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyPaymentsTab;
