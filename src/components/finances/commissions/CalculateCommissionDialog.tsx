
import React, { useState } from "react";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Policy } from "@/types/policies";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalculateCommissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy;
  onCalculate: (params: { policyId: string; baseAmount: number; rate: number }) => void;
  isCalculating: boolean;
}

const CalculateCommissionDialog: React.FC<CalculateCommissionDialogProps> = ({ 
  open, 
  onOpenChange, 
  policy, 
  onCalculate,
  isCalculating
}) => {
  const { t, formatCurrency } = useLanguage();
  const { toast } = useToast();
  
  // Create schema for commission calculation form
  const formSchema = z.object({
    baseAmount: z.number().positive({ message: t("amountMustBePositive") }),
    rate: z.number().min(0, { message: t("rateMustBeNonNegative") }).max(100, { message: t("rateCannotExceed100") }),
  });

  // Initialize form with default values from policy
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseAmount: policy.premium || 0,
      rate: policy.commission_percentage || 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onCalculate({
      policyId: policy.id,
      baseAmount: values.baseAmount,
      rate: values.rate,
    });
  };

  // Calculate preview of commission amount
  const calculatePreview = () => {
    const baseAmount = form.watch("baseAmount");
    const rate = form.watch("rate");
    if (baseAmount && rate) {
      return (baseAmount * rate) / 100;
    }
    return 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("calculateCommission")}</DialogTitle>
          <DialogDescription>
            {t("calculateCommissionForPolicy", { policyNumber: policy.policy_number })}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="baseAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("baseAmount")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("commissionRate")} (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="p-4 border rounded-md bg-muted/20">
              <p className="text-sm text-muted-foreground mb-1">{t("calculatedCommission")}</p>
              <p className="text-lg font-medium">
                {formatCurrency(calculatePreview(), policy.currency)}
              </p>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isCalculating}>
                {isCalculating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("calculateAndSave")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CalculateCommissionDialog;
