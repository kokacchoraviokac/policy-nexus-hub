
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus, ChevronDown, ChevronUp, DollarSign, Link } from "lucide-react";
import { UnlinkedPaymentType } from "@/types/policies";
import { useNavigate } from "react-router-dom";

interface PolicyPaymentHistoryProps {
  paymentsData: UnlinkedPaymentType[];
  policyId: string;
  premium: number;
  currency: string;
  onExportPayments: () => void;
}

const PolicyPaymentHistory: React.FC<PolicyPaymentHistoryProps> = ({ 
  paymentsData, 
  policyId, 
  premium, 
  currency,
  onExportPayments 
}) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const navigate = useNavigate();
  const [showAllPayments, setShowAllPayments] = useState(false);
  
  const totalPaid = paymentsData?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const displayedPayments = showAllPayments ? paymentsData : paymentsData?.slice(0, 3);
  
  const handleAddPayment = () => {
    navigate('/finances/unlinked-payments', { 
      state: { fromPolicyId: policyId } 
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("paymentHistory")}</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={!paymentsData || paymentsData.length === 0}
            onClick={onExportPayments}
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
                        {payment.linked_at ? formatDate(payment.linked_at) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/20">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm font-semibold">{t("total")}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">
                      {formatCurrency(totalPaid, currency)}
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
  );
};

export default PolicyPaymentHistory;
