
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommissionType } from "@/types/finances";
import { Loader2 } from "lucide-react";

interface UpdateCommissionStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commission: CommissionType & { currency?: string };
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
  
  // Create schema for status update form
  const formSchema = z.object({
    status: z.enum(["due", "partially_paid", "paid"]),
    paymentDate: z.string().optional(),
    paidAmount: z.number().optional()
  }).refine((data) => {
    // If status is paid or partially_paid, paymentDate should be provided
    if ((data.status === 'paid' || data.status === 'partially_paid') && !data.paymentDate) {
      return false;
    }
    return true;
  }, {
    message: t("paymentDateRequired"),
    path: ["paymentDate"]
  }).refine((data) => {
    // If status is partially_paid, paidAmount should be provided
    if (data.status === 'partially_paid' && !data.paidAmount) {
      return false;
    }
    return true;
  }, {
    message: t("paidAmountRequired"),
    path: ["paidAmount"]
  }).refine((data) => {
    // If status is paid, paidAmount should be provided and equal to or greater than calculated amount
    if (data.status === 'paid' && (!data.paidAmount || data.paidAmount < commission.calculated_amount)) {
      return false;
    }
    return true;
  }, {
    message: t("paidAmountShouldBeAtLeastCalculated"),
    path: ["paidAmount"]
  });

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: commission.status,
      paymentDate: commission.payment_date || '',
      paidAmount: commission.paid_amount || undefined
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onUpdateStatus({
      commissionId: commission.id,
      status: values.status,
      paymentDate: values.paymentDate,
      paidAmount: values.paidAmount
    });
    onOpenChange(false);
  };

  // Watch status to show/hide additional fields
  const currentStatus = form.watch("status");
  const showPaymentFields = currentStatus === 'paid' || currentStatus === 'partially_paid';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("updateCommissionStatus")}</DialogTitle>
          <DialogDescription>
            {t("calculatedCommission")}: {formatCurrency(commission.calculated_amount, commission.currency || 'EUR')}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="p-4 border rounded-md bg-muted/20 mb-4">
              <p className="text-sm text-muted-foreground">{t("currentStatus")}</p>
              <p className="font-medium capitalize">{t(commission.status)}</p>
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("newStatus")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="due">{t("due")}</SelectItem>
                      <SelectItem value="partially_paid">{t("partially_paid")}</SelectItem>
                      <SelectItem value="paid">{t("paid")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {showPaymentFields && (
              <>
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("paymentDate")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="paidAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("paidAmount")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("updateStatus")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCommissionStatusDialog;
