
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Commission, CommissionStatus } from "@/types/finances";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import CommissionStatusBadge from "./CommissionStatusBadge";

interface UpdateCommissionStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commission: Commission;
  onUpdate: (data: { commissionId: string; status: CommissionStatus; paymentDate?: string; paidAmount?: number }) => void;
  isUpdating: boolean;
}

// This schema is for the form's values
const formSchema = z.object({
  status: z.enum(["due", "partially_paid", "paid", "pending", "invoiced"] as const),
  paymentDate: z.date().optional(),
  paidAmount: z.number().optional(),
}).superRefine((data, ctx) => {
  if (data.status === "paid" || data.status === "partially_paid") {
    // Payment date is required
    if (!data.paymentDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paymentDateRequired",
        path: ["paymentDate"],
      });
    }
    
    // Paid amount is required
    if (data.paidAmount === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paidAmountRequired",
        path: ["paidAmount"],
      });
    } else if (data.paidAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "amountMustBePositive",
        path: ["paidAmount"],
      });
    }
  }
});

type FormValues = z.infer<typeof formSchema>;

const UpdateCommissionStatusDialog: React.FC<UpdateCommissionStatusDialogProps> = ({
  open,
  onOpenChange,
  commission,
  onUpdate,
  isUpdating,
}) => {
  const { t, formatCurrency } = useLanguage();
  
  // Default to "due" if current status is "calculating"
  const defaultStatus = commission.status === "calculating" ? "due" as CommissionStatus : commission.status;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: defaultStatus,
      paymentDate: commission.payment_date ? new Date(commission.payment_date) : undefined,
      paidAmount: commission.paid_amount,
    },
  });
  
  const selectedStatus = form.watch("status");
  
  const handleSubmit = (values: FormValues) => {
    onUpdate({
      commissionId: commission.id,
      status: values.status as CommissionStatus,
      paymentDate: values.paymentDate ? values.paymentDate.toISOString() : undefined,
      paidAmount: values.paidAmount,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("updateCommissionStatus")}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">{t("calculatedCommission")}</p>
              <p className="text-xl font-semibold">{formatCurrency(commission.calculated_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("currentStatus")}</p>
              <div className="mt-1">
                <CommissionStatusBadge status={commission.status} />
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                        <SelectItem value="pending">{t("pending")}</SelectItem>
                        <SelectItem value="invoiced">{t("invoiced")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {(selectedStatus === "paid" || selectedStatus === "partially_paid") && (
                <>
                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("paymentDate")}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={
                                  "w-full pl-3 text-left font-normal " +
                                  (!field.value && "text-muted-foreground")
                                }
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>{t("selectDate")}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => 
                                date > new Date() || 
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? undefined : parseFloat(value));
                            }}
                            step="0.01"
                            min="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isUpdating}
                >
                  {isUpdating ? t("processing") : t("updateStatus")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCommissionStatusDialog;
