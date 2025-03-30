
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CreditCard, User, FileText } from "lucide-react";
import { UnlinkedPaymentType } from "@/types/policies";
import { format } from "date-fns";

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: UnlinkedPaymentType;
}

const PaymentDetailsDialog: React.FC<PaymentDetailsDialogProps> = ({
  open,
  onOpenChange,
  payment
}) => {
  const { t, formatCurrency } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("paymentDetails")}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("reference")}</p>
                <p className="font-medium">{payment.reference || "-"}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("payerName")}</p>
                <p className="font-medium">{payment.payer_name || "-"}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("amount")}</p>
                <p className="font-medium">
                  {formatCurrency(payment.amount, payment.currency)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("paymentDate")}</p>
                <p className="font-medium">
                  {format(new Date(payment.payment_date), "PP")}
                </p>
              </div>
            </div>
          </div>
          
          {payment.linked_policy_id && (
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium">{t("paymentLinked")}</p>
              <p className="text-sm text-muted-foreground">
                {t("paymentAlreadyLinked")}
              </p>
              <p className="text-sm mt-2">
                <span className="text-muted-foreground">{t("linkedAt")}: </span>
                {payment.linked_at ? format(new Date(payment.linked_at), "PPp") : "-"}
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
