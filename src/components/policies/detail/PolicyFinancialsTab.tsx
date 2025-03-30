
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calculator, DollarSign, Receipt, Download, Plus, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: 0,
    reference: "",
    payment_date: format(new Date(), "yyyy-MM-dd"),
  });
  const [commissionDialogOpen, setCommissionDialogOpen] = useState(false);
  const [commissionFormData, setCommissionFormData] = useState({
    rate: 0,
    base_amount: 0,
  });

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

  const addPaymentMutation = useMutation({
    mutationFn: async (data: typeof paymentFormData) => {
      const { error } = await supabase
        .from('unlinked_payments')
        .insert({
          amount: data.amount,
          reference: data.reference,
          payment_date: data.payment_date,
          linked_policy_id: policyId,
          linked_at: new Date().toISOString(),
          status: 'linked',
          currency: financialData?.currency || 'EUR',
          payer_name: 'Manual Payment',
          company_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-financials', policyId] });
      toast({
        title: t("paymentAdded"),
        description: t("paymentSuccessfullyAdded"),
      });
      setPaymentDialogOpen(false);
      resetPaymentForm();
    },
    onError: (error) => {
      console.error('Error adding payment:', error);
      toast({
        title: t("errorAddingPayment"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  const calculateCommissionMutation = useMutation({
    mutationFn: async (data: typeof commissionFormData) => {
      const calculated_amount = (data.base_amount * data.rate) / 100;
      
      const { error } = await supabase
        .from('commissions')
        .insert({
          policy_id: policyId,
          base_amount: data.base_amount,
          rate: data.rate,
          calculated_amount: calculated_amount,
          status: 'pending',
          company_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      if (error) throw error;
      return { ...data, calculated_amount };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['policy-financials', policyId] });
      toast({
        title: t("commissionCalculated"),
        description: t("commissionCalculationResult", { 
          amount: formatCurrency(data.calculated_amount, financialData?.currency || 'EUR')
        }),
      });
      setCommissionDialogOpen(false);
      resetCommissionForm();
    },
    onError: (error) => {
      console.error('Error calculating commission:', error);
      toast({
        title: t("errorCalculatingCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  const markCommissionAsPaidMutation = useMutation({
    mutationFn: async (commissionId: string) => {
      const { error } = await supabase
        .from('commissions')
        .update({
          status: 'paid',
          payment_date: new Date().toISOString().split('T')[0],
          paid_amount: (await supabase.from('commissions').select('calculated_amount').eq('id', commissionId).single()).data?.calculated_amount
        })
        .eq('id', commissionId);
      
      if (error) throw error;
      return commissionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-financials', policyId] });
      toast({
        title: t("commissionMarkedAsPaid"),
        description: t("commissionSuccessfullyMarkedAsPaid"),
      });
    },
    onError: (error) => {
      console.error('Error marking commission as paid:', error);
      toast({
        title: t("errorMarkingCommissionAsPaid"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });

  const handleAddPayment = () => {
    // Initialize with the remaining amount to be paid
    if (financialData) {
      const remaining = financialData.premium - financialData.totalPaid;
      setPaymentFormData({
        ...paymentFormData,
        amount: remaining > 0 ? remaining : 0,
      });
    }
    setPaymentDialogOpen(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    addPaymentMutation.mutate(paymentFormData);
  };

  const resetPaymentForm = () => {
    setPaymentFormData({
      amount: 0,
      reference: "",
      payment_date: format(new Date(), "yyyy-MM-dd"),
    });
  };

  const handleCalculateCommission = () => {
    // Initialize with the policy premium
    if (financialData) {
      setCommissionFormData({
        base_amount: financialData.premium,
        rate: 10, // Default rate
      });
    }
    setCommissionDialogOpen(true);
  };

  const handleSubmitCommission = (e: React.FormEvent) => {
    e.preventDefault();
    calculateCommissionMutation.mutate(commissionFormData);
  };

  const resetCommissionForm = () => {
    setCommissionFormData({
      base_amount: 0,
      rate: 0,
    });
  };

  const handleMarkAsPaid = (commissionId: string) => {
    markCommissionAsPaidMutation.mutate(commissionId);
  };

  const handleExportFinancials = () => {
    toast({
      title: t("exportFinancials"),
      description: t("exportFinancialsDescription"),
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-semibold">{t("financialDetails")}</h2>
          <p className="text-muted-foreground">{t("policyFinancialManagement")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleExportFinancials}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t("export")}
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="payments">{t("payments")}</TabsTrigger>
          <TabsTrigger value="commissions">{t("commissions")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Button size="sm" onClick={handleAddPayment}>
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
                    {financialData.commissions.slice(0, 3).map((commission) => (
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkAsPaid(commission.id)}
                          >
                            {t("markAsPaid")}
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {financialData.commissions.length > 3 && (
                      <Button 
                        variant="ghost" 
                        className="w-full text-muted-foreground"
                        onClick={() => setActiveTab("commissions")}
                      >
                        {t("viewAllCommissions")}
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
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
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("paymentHistory")}</CardTitle>
              <Button size="sm" onClick={handleAddPayment}>
                <Plus className="mr-2 h-4 w-4" />
                {t("recordPayment")}
              </Button>
            </CardHeader>
            <CardContent>
              {financialData.payments && financialData.payments.length > 0 ? (
                <div className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">{t("paymentDate")}</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">{t("reference")}</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">{t("amount")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {financialData.payments.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-4 py-3 text-sm">{formatDate(payment.payment_date)}</td>
                            <td className="px-4 py-3 text-sm">{payment.reference || "-"}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium">
                              {formatCurrency(payment.amount, financialData.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/20">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 text-sm font-semibold">{t("total")}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold">
                            {formatCurrency(financialData.totalPaid, financialData.currency)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-muted/10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <h4 className="font-medium">{t("paymentSummary")}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("totalPaymentsRecorded")}: {financialData.payments.length}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{t("paymentProgress")}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={paymentPercentage} className="h-2 w-24" />
                          <span className="text-sm font-medium">{Math.round(paymentPercentage)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/30">
                  <DollarSign className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="font-medium">{t("noPaymentsRecorded")}</h3>
                  <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto text-sm">
                    {t("noPaymentsDescription")}
                  </p>
                  <Button onClick={handleAddPayment} size="sm">
                    {t("recordFirstPayment")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("commissionHistory")}</CardTitle>
              <Button size="sm" onClick={handleCalculateCommission}>
                <Calculator className="mr-2 h-4 w-4" />
                {t("calculateCommission")}
              </Button>
            </CardHeader>
            <CardContent>
              {financialData.commissions && financialData.commissions.length > 0 ? (
                <div className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">{t("createdAt")}</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">{t("baseAmount")}</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">{t("rate")}</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">{t("calculatedAmount")}</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">{t("status")}</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">{t("actions")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {financialData.commissions.map((commission) => (
                          <tr key={commission.id}>
                            <td className="px-4 py-3 text-sm">{formatDate(commission.created_at)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              {formatCurrency(commission.base_amount, financialData.currency)}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">{commission.rate}%</td>
                            <td className="px-4 py-3 text-sm text-right font-medium">
                              {formatCurrency(commission.calculated_amount, financialData.currency)}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              <Badge 
                                variant={commission.status === 'paid' ? 'default' : 'outline'}
                                className="mx-auto"
                              >
                                {commission.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              {commission.status !== 'paid' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleMarkAsPaid(commission.id)}
                                >
                                  {t("markAsPaid")}
                                </Button>
                              )}
                              {commission.status === 'paid' && commission.payment_date && (
                                <span className="text-xs text-muted-foreground">
                                  {t("paidOn")}: {formatDate(commission.payment_date)}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/30">
                  <Calculator className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="font-medium">{t("noCommissionsFound")}</h3>
                  <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto text-sm">
                    {t("noCommissionsDescription")}
                  </p>
                  <Button onClick={handleCalculateCommission} size="sm">
                    {t("calculateFirstCommission")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("recordPayment")}</DialogTitle>
            <DialogDescription>
              {t("recordPaymentDescription")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPayment}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">{t("amount")}</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={paymentFormData.amount}
                  onChange={(e) => setPaymentFormData({
                    ...paymentFormData,
                    amount: parseFloat(e.target.value) || 0
                  })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">{t("reference")}</Label>
                <Input
                  id="reference"
                  value={paymentFormData.reference}
                  onChange={(e) => setPaymentFormData({
                    ...paymentFormData,
                    reference: e.target.value
                  })}
                  placeholder={t("paymentReference")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_date">{t("paymentDate")}</Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={paymentFormData.payment_date}
                  onChange={(e) => setPaymentFormData({
                    ...paymentFormData,
                    payment_date: e.target.value
                  })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={addPaymentMutation.isPending}>
                {addPaymentMutation.isPending ? t("saving") : t("savePayment")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Calculate Commission Dialog */}
      <Dialog open={commissionDialogOpen} onOpenChange={setCommissionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("calculateCommission")}</DialogTitle>
            <DialogDescription>
              {t("calculateCommissionDescription")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCommission}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="base_amount">{t("baseAmount")}</Label>
                <Input
                  id="base_amount"
                  type="number"
                  step="0.01"
                  value={commissionFormData.base_amount}
                  onChange={(e) => setCommissionFormData({
                    ...commissionFormData,
                    base_amount: parseFloat(e.target.value) || 0
                  })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">{t("commissionRate")}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="rate"
                    type="number"
                    step="0.1"
                    value={commissionFormData.rate}
                    onChange={(e) => setCommissionFormData({
                      ...commissionFormData,
                      rate: parseFloat(e.target.value) || 0
                    })}
                    required
                    className="flex-1"
                  />
                  <span className="text-lg">%</span>
                </div>
              </div>

              {commissionFormData.base_amount > 0 && commissionFormData.rate > 0 && (
                <div className="p-4 border rounded-md mt-4 bg-muted/20">
                  <div className="text-sm text-muted-foreground">{t("estimatedCommission")}</div>
                  <div className="text-xl font-bold mt-1">
                    {formatCurrency((commissionFormData.base_amount * commissionFormData.rate) / 100, financialData.currency)}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCommissionDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={calculateCommissionMutation.isPending}>
                {calculateCommissionMutation.isPending ? t("calculating") : t("saveCommission")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PolicyFinancialsTab;
