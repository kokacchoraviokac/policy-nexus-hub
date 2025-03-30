
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UnlinkedPaymentType } from "@/types/policies";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { DollarSign, Calendar, User, FileText, Link, ExternalLink } from "lucide-react";

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
  const { t, formatCurrency, formatDate, formatDateTime } = useLanguage();
  const navigate = useNavigate();

  const viewLinkedPolicy = () => {
    if (payment.linked_policy_id) {
      onOpenChange(false);
      navigate(`/policies/${payment.linked_policy_id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{t("paymentDetails")}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{payment.reference || t("paymentReference")}</h3>
            <Badge variant={payment.linked_policy_id ? "default" : "outline"}>
              {payment.linked_policy_id ? t("linked") : t("unlinked")}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("amount")}: </span>
                <span className="font-medium">{formatCurrency(payment.amount, payment.currency)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("paymentDate")}: </span>
                <span className="font-medium">{formatDate(payment.payment_date)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("reference")}: </span>
                <span className="font-medium">{payment.reference || "-"}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("payerName")}: </span>
                <span className="font-medium">{payment.payer_name || "-"}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("currency")}: </span>
                <span className="font-medium">{payment.currency}</span>
              </div>
              
              {payment.linked_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("linkedAt")}: </span>
                  <span className="font-medium">{formatDateTime(payment.linked_at)}</span>
                </div>
              )}
            </div>
          </div>
          
          {payment.linked_policy_id && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-center text-blue-800 mb-2">
                <Link className="h-4 w-4 mr-2" />
                <span className="font-medium">{t("linkedPolicy")}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-1" 
                onClick={viewLinkedPolicy}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                {t("viewPolicy")}
              </Button>
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
