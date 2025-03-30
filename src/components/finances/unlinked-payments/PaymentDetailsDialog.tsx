
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UnlinkedPaymentType } from "@/types/policies";
import { CalendarClock, CreditCard, Hash, User, DollarSign, CheckCircle, Link } from "lucide-react";

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: UnlinkedPaymentType | null;
}

const PaymentDetailsDialog: React.FC<PaymentDetailsDialogProps> = ({
  open,
  onOpenChange,
  payment
}) => {
  const { t, formatCurrency, formatDate } = useLanguage();

  if (!payment) return null;

  const detailItems = [
    {
      icon: <Hash className="h-4 w-4 text-muted-foreground" />,
      label: t("reference"),
      value: payment.reference || "-"
    },
    {
      icon: <User className="h-4 w-4 text-muted-foreground" />,
      label: t("payerName"),
      value: payment.payer_name || "-"
    },
    {
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      label: t("amount"),
      value: formatCurrency(payment.amount, payment.currency)
    },
    {
      icon: <CalendarClock className="h-4 w-4 text-muted-foreground" />,
      label: t("paymentDate"),
      value: formatDate(payment.payment_date)
    },
    {
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
      label: t("currency"),
      value: payment.currency
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("paymentDetails")}</DialogTitle>
        </DialogHeader>
        
        <div className="my-4">
          <div className="flex items-center space-x-2 mb-4">
            {payment.linked_policy_id ? (
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center text-sm">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                {t("linked")}
              </div>
            ) : (
              <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full flex items-center text-sm">
                <Link className="h-3.5 w-3.5 mr-1" />
                {t("unlinked")}
              </div>
            )}
          </div>
        
          <div className="space-y-3">
            {detailItems.map((item, index) => (
              <div key={index} className="flex items-center py-2 border-b last:border-b-0">
                <div className="flex items-center w-1/3 text-sm">
                  {item.icon}
                  <span className="ml-2 text-muted-foreground">{item.label}</span>
                </div>
                <div className="w-2/3 font-medium">{item.value}</div>
              </div>
            ))}
          </div>
          
          {payment.linked_at && (
            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">
                {t("linkedAt")}: {formatDate(payment.linked_at)}
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailsDialog;
