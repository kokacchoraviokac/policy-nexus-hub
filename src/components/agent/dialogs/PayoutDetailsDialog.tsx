
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePayoutDetails } from "@/hooks/agent/usePayoutDetails";
import { Loader2, Download } from "lucide-react";
import { format } from "date-fns";

interface PayoutDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  payoutId: string;
}

const PayoutDetailsDialog = ({
  open,
  onClose,
  payoutId
}: PayoutDetailsDialogProps) => {
  const { t } = useLanguage();
  const { payoutDetails, isLoading, exportPayoutDetails } = usePayoutDetails(payoutId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {t("payoutDetails")}
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : payoutDetails ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("agent")}</p>
                <p className="font-medium">{payoutDetails.agent_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("status")}</p>
                <p className="font-medium">{t(payoutDetails.status)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("period")}</p>
                <p className="font-medium">
                  {format(new Date(payoutDetails.period_start), 'P')} - {format(new Date(payoutDetails.period_end), 'P')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("totalAmount")}</p>
                <p className="font-medium">{payoutDetails.total_amount.toFixed(2)}</p>
              </div>
              {payoutDetails.payment_date && (
                <div>
                  <p className="text-sm text-muted-foreground">{t("paymentDate")}</p>
                  <p className="font-medium">{format(new Date(payoutDetails.payment_date), 'P')}</p>
                </div>
              )}
              {payoutDetails.payment_reference && (
                <div>
                  <p className="text-sm text-muted-foreground">{t("paymentReference")}</p>
                  <p className="font-medium">{payoutDetails.payment_reference}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">{t("payoutItems")}</h3>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs">{t("policy")}</th>
                      <th className="px-4 py-2 text-left text-xs">{t("policyholder")}</th>
                      <th className="px-4 py-2 text-right text-xs">{t("amount")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutDetails.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 text-sm">{item.policy_number}</td>
                        <td className="px-4 py-2 text-sm">{item.policyholder_name}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>{t("payoutNotFound")}</p>
          </div>
        )}
        
        <DialogFooter>
          {payoutDetails && (
            <Button 
              variant="outline" 
              onClick={() => exportPayoutDetails(payoutId)}
              className="mr-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              {t("exportDetails")}
            </Button>
          )}
          <Button onClick={onClose}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayoutDetailsDialog;
