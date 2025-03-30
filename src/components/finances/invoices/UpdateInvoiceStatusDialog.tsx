
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { updateInvoiceStatus } from "@/hooks/finances/useInvoiceMutations";
import { supabase } from "@/integrations/supabase/client";

interface UpdateInvoiceStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  currentStatus: string;
  onStatusUpdated?: () => void;
}

type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled';

const UpdateInvoiceStatusDialog: React.FC<UpdateInvoiceStatusDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  currentStatus,
  onStatusUpdated,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [status, setStatus] = useState<InvoiceStatus>(currentStatus as InvoiceStatus || 'draft');
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define available status options based on current status
  const getAvailableStatusOptions = () => {
    switch (currentStatus) {
      case 'draft':
        return ['draft', 'issued', 'cancelled'];
      case 'issued':
        return ['issued', 'paid', 'cancelled'];
      case 'paid':
        return ['paid'];
      case 'cancelled':
        return ['cancelled'];
      default:
        return ['draft', 'issued', 'paid', 'cancelled'];
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Update invoice status
      const { error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', invoiceId);
      
      if (error) throw error;
      
      // If status is 'paid', record payment date
      if (status === 'paid' && paymentDate) {
        // Here we would record the payment in a payments table if we had one
        // For now, just update the invoice
      }
      
      toast({
        title: t("invoiceUpdated"),
        description: t("invoiceStatusUpdatedSuccess"),
      });
      
      onOpenChange(false);
      if (onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast({
        title: t("errorUpdatingInvoice"),
        description: t("errorUpdatingInvoiceDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("updateInvoiceStatus")}</DialogTitle>
          <DialogDescription>
            {t("updateInvoiceStatusDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">{t("newStatus")}</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as InvoiceStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                {getAvailableStatusOptions().map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {status === 'paid' && (
            <div className="space-y-2">
              <Label htmlFor="paymentDate">{t("paymentDate")}</Label>
              <DatePicker
                date={paymentDate}
                setDate={setPaymentDate}
                placeholder={t("selectPaymentDate")}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || status === currentStatus}
          >
            {isSubmitting ? t("updating") : t("updateStatus")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateInvoiceStatusDialog;

// Separate function to update invoice status outside of component
export const updateInvoiceStatus = async (invoiceId: string, status: InvoiceStatus) => {
  try {
    const { error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', invoiceId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating invoice status:", error);
    throw error;
  }
};
