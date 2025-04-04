
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuoteRequest } from "@/types/quotes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { calendar } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form schema for quote creation
const quoteFormSchema = z.object({
  insurerName: z.string().min(1, "Insurer name is required"),
  coverageDetails: z.string().min(1, "Coverage details are required"),
  requestedAmount: z.string().optional(),
  currency: z.string().default("EUR"),
  notes: z.string().optional(),
  coverageStartDate: z.date().optional(),
  coverageEndDate: z.date().optional()
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface AddQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteAdded: (quoteData: QuoteRequest) => void;
}

const AddQuoteDialog: React.FC<AddQuoteDialogProps> = ({
  open,
  onOpenChange,
  onQuoteAdded
}) => {
  const { t } = useLanguage();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      insurerName: "",
      coverageDetails: "",
      requestedAmount: "",
      currency: "EUR",
      notes: "",
    }
  });

  const handleSubmit = async (values: QuoteFormValues) => {
    const quoteData: QuoteRequest = {
      salesProcessId: "", // This will be set by the parent component
      insurerName: values.insurerName,
      coverageDetails: values.coverageDetails,
      requestedAmount: values.requestedAmount,
      currency: values.currency,
      notes: values.notes,
      coverageStartDate: values.coverageStartDate ? format(values.coverageStartDate, "yyyy-MM-dd") : undefined,
      coverageEndDate: values.coverageEndDate ? format(values.coverageEndDate, "yyyy-MM-dd") : undefined
    };
    
    onQuoteAdded(quoteData);
    onOpenChange(false);
    form.reset();
  };
  
  const isSubmitting = form.formState.isSubmitting;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{t("addQuote")}</DialogTitle>
          <DialogDescription>
            {t("createQuoteDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="insurerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("insurer")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterInsurerName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requestedAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("amount")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterAmount")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("currency")}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectCurrency")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="RSD">RSD (РСД)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="coverageDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("coverageDetails")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("enterCoverageDetails")} 
                      {...field} 
                      className="min-h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coverageStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("coverageStartDate")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                name="coverageEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("coverageEndDate")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notes")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("optionalNotes")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("saving") : t("addQuote")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuoteDialog;
