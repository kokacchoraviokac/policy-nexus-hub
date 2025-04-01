
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteAdded: (quoteData: { insurer: string; amount: string; coverage: string }) => void;
}

// Form schema
const formSchema = z.object({
  insurer: z.string().min(1, { message: "Insurer name is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  coverage: z.string().min(1, { message: "Coverage details are required" }),
});

type FormValues = z.infer<typeof formSchema>;

const AddQuoteDialog: React.FC<AddQuoteDialogProps> = ({
  open,
  onOpenChange,
  onQuoteAdded,
}) => {
  const { t } = useLanguage();
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insurer: "",
      amount: "",
      coverage: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    onQuoteAdded(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("addNewQuote")}</DialogTitle>
          <DialogDescription>
            {t("addQuoteDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="insurer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("insurerName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterInsurerName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("quoteAmount")}</FormLabel>
                  <FormControl>
                    <Input placeholder="€0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("coverageDetails")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("enterCoverageDetails")} 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit">{t("addQuote")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuoteDialog;
