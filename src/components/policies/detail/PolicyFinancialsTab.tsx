
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calculator, DollarSign, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface PolicyFinancialsTabProps {
  policyId: string;
}

interface Commission {
  id: string;
  status: string;
  base_amount: number;
  calculated_amount: number;
  paid_amount: number | null;
  payment_date: string | null;
  rate: number;
  created_at: string;
}

interface Payment {
  id: string;
  amount: number;
  payment_date: string;
  reference: string;
  status: string;
}

const PolicyFinancialsTab: React.FC<PolicyFinancialsTabProps> = ({ policyId }) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const { toast } = useToast();

  const { data: financialData, isLoading, isError, refetch } = useQuery({
    queryKey: ['policy-financials', policyId],
    queryFn: async () => {
      // Get commissions
      const { data: commissions, error: commissionsError } = await supabase
        .from('commissions')
        .select('*')
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });
      
      if (commissionsError) throw commissionsError;
      
      // Get payments - assuming we have unlinked_payments table with linked_policy_id
      const { data: payments, error: paymentsError } = await supabase
        .from('unlinked_payments')
        .select('*')
        .eq('linked_policy_id', policyId)
        .order('payment_date', { ascending: false });
      
      if (paymentsError) throw paymentsError;
      
      // Get policy details for premium
      const { data: policy, error: policyError } = await supabase
        .from('policies')
        .select('premium, currency')
        .eq('id', policyId)
        .single();
      
      if (policyError) throw policyError;
      
      // Calculate total paid
      const totalPaid = payments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
      
      return {
        commissions: commissions as Commission[],
        payments: payments as Payment[],
        premium: policy.premium,
        currency: policy.currency,
        totalPaid: totalPaid
      };
    },
  });

  const handleCalculateCommission = () => {
    toast({
      title: t("commissionCalculation"),
      description: t("commissionCalculationStarted"),
    });
  };

  const handleRecordPayment = () => {
    toast({
      title: t("recordPayment"),
      description: t("recordPaymentFeatureNotAvailable"),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("paymentSummary")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
            <Skeleton className="h-8 mt-4" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("commissions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center py-6">
            <h3 className="text-lg font-medium text-destructive">{t("errorLoadingFinancials")}</h3>
            <p className="text-muted-foreground mt-2">{t("tryRefreshingPage")}</p>
            <Button className="mt-4" onClick={() => refetch()}>
              {t("refresh")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const paymentPercentage = financialData.premium > 0 
    ? (financialData.totalPaid / financialData.premium) * 100
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("paymentSummary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("totalPremium")}</p>
                  <p className="text-xl font-semibold mt-1">
                    {formatCurrency(financialData.premium, financialData.currency)}
                  </p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("totalPaid")}</p>
                  <p className="text-xl font-semibold mt-1">
                    {formatCurrency(financialData.totalPaid, financialData.currency)}
                  </p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("remainingAmount")}</p>
                  <p className="text-xl font-semibold mt-1">
                    {formatCurrency(financialData.premium - financialData.totalPaid, financialData.currency)}
                  </p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">{t("paymentProgress")}</p>
              <p className="text-sm">{Math.round(paymentPercentage)}%</p>
            </div>
            <Progress value={paymentPercentage} className="h-2" />
            
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={handleRecordPayment}>
                {t("recordPayment")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("commissions")}</CardTitle>
          <Button size="sm" onClick={handleCalculateCommission}>
            {t("calculateCommission")}
          </Button>
        </CardHeader>
        <CardContent>
          {financialData.commissions && financialData.commissions.length > 0 ? (
            <div className="space-y-4">
              {financialData.commissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">
                        {formatCurrency(commission.calculated_amount, financialData.currency)}
                      </p>
                      <Badge variant={commission.status === 'paid' ? 'default' : 'outline'}>
                        {commission.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <p>{t("rate")}: {commission.rate}%</p>
                      <p>{t("baseAmount")}: {formatCurrency(commission.base_amount, financialData.currency)}</p>
                      {commission.payment_date && (
                        <p>{t("paidOn")}: {formatDate(commission.payment_date)}</p>
                      )}
                    </div>
                  </div>
                  
                  {commission.status !== 'paid' && (
                    <Button variant="outline" size="sm">
                      {t("markAsPaid")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border rounded-md bg-muted/30">
              <h3 className="font-medium">{t("noCommissionsFound")}</h3>
              <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto text-sm">
                {t("noCommissionsDescription")}
              </p>
              <Button size="sm" onClick={handleCalculateCommission}>
                {t("calculateCommission")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyFinancialsTab;
