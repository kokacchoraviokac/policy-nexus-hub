
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Plus, 
  Filter, 
  Download, 
  RefreshCw, 
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Link
} from "lucide-react";
import { UnlinkedPaymentType } from "@/types/policies";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PolicyPaymentsTabProps {
  policyId: string;
}

const PolicyPaymentsTab: React.FC<PolicyPaymentsTabProps> = ({ policyId }) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const navigate = useNavigate();
  const [showAllPayments, setShowAllPayments] = useState(false);

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
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalPaid = paymentsData?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const premium = policyData?.premium || 0;
  const paymentPercentage = premium > 0 ? Math.min(100, (totalPaid / premium) * 100) : 0;
  const remainingAmount = Math.max(0, premium - totalPaid);
  const isFullyPaid = totalPaid >= premium;
  const isOverpaid = totalPaid > premium;
  const displayedPayments = showAllPayments ? paymentsData : paymentsData?.slice(0, 3);

  const handleAddPayment = () => {
    navigate('/finances/unlinked-payments', { 
      state: { fromPolicyId: policyId } 
    });
  };

  const handleExportPayments = () => {
    // Create CSV of payments
    if (!paymentsData || paymentsData.length === 0) return;
    
    const csvContent = [
      ["Payment Date", "Reference", "Payer Name", "Amount", "Currency"].join(","),
      ...paymentsData.map(payment => [
        formatDate(payment.payment_date),
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

      <Card>
        <CardHeader>
          <CardTitle>{t("paymentSummary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-md bg-muted/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("totalPremium")}</p>
                  <p className="text-xl font-semibold mt-1">
                    {formatCurrency(premium, policyData?.currency)}
                  </p>
                </div>
                <div className="bg-primary/10 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md bg-muted/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("totalPaid")}</p>
                  <p className="text-xl font-semibold mt-1">
                    {formatCurrency(totalPaid, policyData?.currency)}
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant={isFullyPaid ? (isOverpaid ? "destructive" : "default") : "outline"} className="ml-2">
                        {isOverpaid ? t("overpaid") : isFullyPaid ? t("fullyPaid") : t("partiallyPaid")}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isOverpaid 
                        ? t("policyIsOverpaidBy", { amount: formatCurrency(totalPaid - premium, policyData?.currency) }) 
                        : isFullyPaid 
                          ? t("policyIsFullyPaid") 
                          : t("policyIsPartiallyPaid", { percent: Math.round(paymentPercentage) })}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="p-4 border rounded-md bg-muted/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("remainingAmount")}</p>
                  <p className="text-xl font-semibold mt-1">
                    {formatCurrency(remainingAmount, policyData?.currency)}
                  </p>
                </div>
                {isOverpaid && (
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">{t("paymentProgress")}</p>
              <p className="text-sm">{Math.round(paymentPercentage)}%</p>
            </div>
            <Progress value={paymentPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("paymentHistory")}</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!paymentsData || paymentsData.length === 0}
              onClick={handleExportPayments}
            >
              <Download className="h-4 w-4 mr-2" />
              {t("export")}
            </Button>
            <Button size="sm" onClick={handleAddPayment}>
              <Plus className="h-4 w-4 mr-2" />
              {t("recordPayment")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentsData && paymentsData.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">{t("date")}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">{t("reference")}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">{t("payerName")}</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">{t("amount")}</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">{t("linkedAt")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {displayedPayments?.map((payment) => (
                      <tr key={payment.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm">{formatDate(payment.payment_date)}</td>
                        <td className="px-4 py-3 text-sm">{payment.reference || "-"}</td>
                        <td className="px-4 py-3 text-sm">{payment.payer_name || "-"}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {payment.linked_at ? formatDate(payment.linked_at, "PP p") : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/20">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-sm font-semibold">{t("total")}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">
                        {formatCurrency(totalPaid, policyData?.currency)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {paymentsData.length > 3 && !showAllPayments && (
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAllPayments(true)} 
                  className="w-full text-muted-foreground"
                >
                  <ChevronDown className="h-4 w-4 mr-2" />
                  {t("showAllPayments", { count: paymentsData.length })}
                </Button>
              )}
              
              {paymentsData.length > 3 && showAllPayments && (
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAllPayments(false)} 
                  className="w-full text-muted-foreground"
                >
                  <ChevronUp className="h-4 w-4 mr-2" />
                  {t("showLessPayments")}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md bg-muted/30">
              <DollarSign className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <h3 className="font-medium">{t("noPaymentsRecorded")}</h3>
              <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto text-sm">
                {t("noPaymentsDescription")}
              </p>
              <Button onClick={handleAddPayment}>
                <Link className="mr-2 h-4 w-4" />
                {t("recordFirstPayment")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyPaymentsTab;
