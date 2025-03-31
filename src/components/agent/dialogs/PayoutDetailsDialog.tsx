
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePayoutDetails } from "@/hooks/agent/usePayoutDetails";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PayoutDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  payoutId: string;
}

const PayoutDetailsDialog: React.FC<PayoutDetailsDialogProps> = ({
  open,
  onClose,
  payoutId,
}) => {
  const { t } = useLanguage();
  const { payoutDetails, isLoading, exportPayoutDetails } = usePayoutDetails(payoutId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("payoutDetails")}</DialogTitle>
          <DialogDescription>
            {t("payoutDetailsDescription")}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !payoutDetails ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t("payoutNotFound")}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("summary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("agent")}</p>
                    <p className="font-medium">{payoutDetails.agent_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("totalAmount")}</p>
                    <p className="font-medium">{formatCurrency(payoutDetails.total_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("period")}</p>
                    <p className="font-medium">
                      {formatDate(payoutDetails.period_start)} - {formatDate(payoutDetails.period_end)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("status")}</p>
                    <p className="font-medium">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        payoutDetails.status === 'paid' ? 'bg-green-100 text-green-800' : 
                        payoutDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t(payoutDetails.status)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("paymentDate")}</p>
                    <p className="font-medium">
                      {payoutDetails.payment_date ? formatDate(payoutDetails.payment_date) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("paymentReference")}</p>
                    <p className="font-medium">
                      {payoutDetails.payment_reference || '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("payoutItems")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("policyNumber")}</TableHead>
                      <TableHead>{t("policyholder")}</TableHead>
                      <TableHead className="text-right">{t("amount")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payoutDetails.items.map((item) => (
                      <TableRow key={item.policy_id}>
                        <TableCell>{item.policy_number}</TableCell>
                        <TableCell>{item.policyholder_name}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()}>
            {t("close")}
          </Button>
          <Button 
            onClick={() => exportPayoutDetails(payoutId)}
            disabled={isLoading || !payoutDetails}
          >
            <Download className="h-4 w-4 mr-2" />
            {t("exportDetails")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayoutDetailsDialog;
