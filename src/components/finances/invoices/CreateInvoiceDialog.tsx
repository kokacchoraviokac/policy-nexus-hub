
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInvoice } from "@/hooks/finances/useInvoiceMutations";
import { PlusCircle, MinusCircle } from "lucide-react";

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceCreated?: () => void;
}

const invoiceFormSchema = z.object({
  invoice_number: z.string().min(1, { message: "Invoice number is required" }),
  entity_type: z.string().min(1, { message: "Entity type is required" }),
  entity_name: z.string().min(1, { message: "Entity name is required" }),
  entity_id: z.string().optional(),
  issue_date: z.date(),
  due_date: z.date(),
  currency: z.string().min(1, { message: "Currency is required" }),
  notes: z.string().optional(),
  invoice_items: z.array(
    z.object({
      description: z.string().min(1, { message: "Description is required" }),
      amount: z.string().refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        { message: "Amount must be a positive number" }
      ),
    })
  ),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({
  open,
  onOpenChange,
  onInvoiceCreated,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoice_number: "",
      entity_type: "client",
      entity_name: "",
      entity_id: "",
      issue_date: new Date(),
      due_date: new Date(new Date().setDate(new Date().getDate() + 30)),
      currency: "EUR",
      notes: "",
      invoice_items: [{ description: "", amount: "" }],
    },
  });

  const handleSubmit = async (values: InvoiceFormValues) => {
    setIsSubmitting(true);
    try {
      // Calculate total amount from invoice items
      const total_amount = values.invoice_items.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      // Transform invoice items to the correct format
      const invoice_items = values.invoice_items.map((item) => ({
        description: item.description,
        amount: Number(item.amount),
      }));

      // Create invoice
      await createInvoice({
        invoice_number: values.invoice_number,
        entity_type: values.entity_type,
        entity_name: values.entity_name,
        entity_id: values.entity_id || undefined,
        issue_date: values.issue_date.toISOString().split("T")[0],
        due_date: values.due_date.toISOString().split("T")[0],
        currency: values.currency,
        total_amount,
        notes: values.notes,
        status: "draft",
        invoice_items,
      });

      toast({
        title: t("invoiceCreated"),
        description: t("invoiceCreatedSuccess"),
      });

      // Close dialog and refresh data
      onOpenChange(false);
      if (onInvoiceCreated) {
        onInvoiceCreated();
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: t("errorCreatingInvoice"),
        description: t("errorCreatingInvoiceDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addInvoiceItem = () => {
    const currentItems = form.getValues("invoice_items");
    form.setValue("invoice_items", [
      ...currentItems,
      { description: "", amount: "" },
    ]);
  };

  const removeInvoiceItem = (index: number) => {
    const currentItems = form.getValues("invoice_items");
    if (currentItems.length > 1) {
      const newItems = [...currentItems];
      newItems.splice(index, 1);
      form.setValue("invoice_items", newItems);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createInvoice")}</DialogTitle>
          <DialogDescription>
            {t("createInvoiceDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoice_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("invoiceNumber")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entity_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("entityType")}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectEntityType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="client">{t("client")}</SelectItem>
                        <SelectItem value="insurer">{t("insurer")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="entity_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("entityName")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="issue_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("issueDate")}</FormLabel>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("dueDate")}</FormLabel>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("currency")}</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCurrency")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="RSD">RSD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t("invoiceItems")}</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addInvoiceItem}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t("addItem")}
                </Button>
              </div>

              {form.getValues("invoice_items").map((_, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <FormField
                    control={form.control}
                    name={`invoice_items.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("itemDescription")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`invoice_items.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormControl>
                          <Input {...field} placeholder={t("amount")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInvoiceItem(index)}
                    disabled={form.getValues("invoice_items").length <= 1}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notes")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormDescription>
                    {t("invoiceNotesDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                type="button"
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("creating") : t("createInvoice")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
