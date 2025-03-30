
import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { CommissionType } from "@/types/finances";

type CommissionStatus = 'due' | 'partially_paid' | 'paid' | 'calculating';

interface UpdateCommissionStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commission: CommissionType & { currency?: string };
  onUpdateStatus: (params: {
    commissionId: string;
    status: string;
    paymentDate?: string;
    paidAmount?: number;
  }) => void;
  isUpdating: boolean;
}

const UpdateCommissionStatusDialog: React.FC<UpdateCommissionStatusDialogProps> = ({
  open,
  onOpenChange,
  commission,
  onUpdateStatus,
  isUpdating,
}) => {
  const { t, formatCurrency } = useLanguage();
  const [status, setStatus] = useState<CommissionStatus>(commission.status as CommissionStatus);
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(
    commission.payment_date ? new Date(commission.payment_date) : undefined
  );
  const [paidAmount, setPaidAmount] = useState<number | undefined>(
    commission.paid_amount !== undefined ? commission.paid_amount : commission.calculated_amount
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onUpdateStatus({
      commissionId: commission.id,
      status,
      paymentDate: paymentDate?.toISOString().split('T')[0],
      paidAmount: ['paid', 'partially_paid'].includes(status) ? paidAmount : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("updateCommissionStatus")}</DialogTitle>
          <DialogDescription>
            {t("updateCommissionStatusDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("currentStatus")}</Label>
            <div className="text-sm font-medium">{t(commission.status)}</div>
          </div>

          <div className="space-y-2">
            <Label>{t("commissionDetails")}</Label>
            <div className="text-sm">
              <p>
                <span className="text-muted-foreground">{t("baseAmount")}: </span>
                {formatCurrency(commission.base_amount, commission.currency || "EUR")}
              </p>
              <p>
                <span className="text-muted-foreground">{t("rate")}: </span>
                {commission.rate}%
              </p>
              <p>
                <span className="text-muted-foreground">{t("calculatedAmount")}: </span>
                {formatCurrency(commission.calculated_amount, commission.currency || "EUR")}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">{t("newStatus")}</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as CommissionStatus)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder={t("selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due">{t("due")}</SelectItem>
                <SelectItem value="partially_paid">{t("partiallyPaid")}</SelectItem>
                <SelectItem value="paid">{t("paid")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {["paid", "partially_paid"].includes(status) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paymentDate">{t("paymentDate")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="paymentDate"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {paymentDate ? (
                        format(paymentDate, "PPP")
                      ) : (
                        <span>{t("selectDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={paymentDate}
                      onSelect={(date) => setPaymentDate(date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidAmount">{t("paidAmount")}</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={status === "paid" ? commission.calculated_amount : undefined}
                  value={paidAmount || ""}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("updating")}
                </>
              ) : (
                t("updateStatus")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCommissionStatusDialog;
