
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommissionType } from "@/types/finances";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

type CommissionStatus = 'due' | 'paid' | 'partially_paid' | 'calculating';

interface UpdateCommissionStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commission: CommissionType & { 
    currency?: string;
  };
  onUpdateStatus: (params: { 
    commissionId: string; 
    status: string; 
    paymentDate?: string; 
    paidAmount?: number 
  }) => void;
  isUpdating: boolean;
}

const UpdateCommissionStatusDialog: React.FC<UpdateCommissionStatusDialogProps> = ({
  open,
  onOpenChange,
  commission,
  onUpdateStatus,
  isUpdating
}) => {
  const { t, formatCurrency } = useLanguage();
  const [status, setStatus] = useState<CommissionStatus>(commission.status as CommissionStatus);
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(
    commission.payment_date ? new Date(commission.payment_date) : undefined
  );
  const [paidAmount, setPaidAmount] = useState<number>(
    commission.paid_amount || commission.calculated_amount
  );

  const handleStatusChange = (value: string) => {
    setStatus(value as CommissionStatus);
    
    // If changing to paid and no payment date is set, set to today
    if (value === 'paid' && !paymentDate) {
      setPaymentDate(new Date());
    }
  };

  const handleSubmit = () => {
    onUpdateStatus({
      commissionId: commission.id,
      status,
      paymentDate: paymentDate ? format(paymentDate, 'yyyy-MM-dd') : undefined,
      paidAmount: status === 'paid' ? paidAmount : undefined
    });
  };

  const isPaidStatus = status === 'paid' || status === 'partially_paid';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("updateCommissionStatus")}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">{t("calculatedAmount")}</p>
              <p className="text-lg font-medium">
                {formatCurrency(commission.calculated_amount, commission.currency || 'EUR')}
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">{t("currentStatus")}</p>
              <p className="text-lg font-medium">
                {t(commission.status)}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">{t("status")}</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger id="status">
                <SelectValue placeholder={t("selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due">{t("due")}</SelectItem>
                <SelectItem value="paid">{t("paid")}</SelectItem>
                <SelectItem value="partially_paid">{t("partiallyPaid")}</SelectItem>
                <SelectItem value="calculating">{t("calculating")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isPaidStatus && (
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
                      onSelect={setPaymentDate}
                      initialFocus
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
                  max={commission.calculated_amount}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                />
                {status === 'partially_paid' && paidAmount >= commission.calculated_amount && (
                  <p className="text-sm text-destructive">
                    {t("partialAmountMustBeLess")}
                  </p>
                )}
                {status === 'paid' && paidAmount < commission.calculated_amount && (
                  <p className="text-sm text-yellow-600">
                    {t("paidAmountLessThanCalculated")}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isUpdating || (isPaidStatus && !paymentDate) || 
                     (status === 'partially_paid' && paidAmount >= commission.calculated_amount)}
          >
            {isUpdating ? t("updating") : t("updateStatus")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCommissionStatusDialog;
