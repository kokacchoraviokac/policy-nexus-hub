
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInvoiceMutations } from "@/hooks/finances/useInvoiceMutations";
import { nanoid } from 'nanoid';
import { Plus, Trash2 } from "lucide-react";

const invoiceSchema = z.object({
  invoice_number: z.string().min(1, { message: "Invoice number is required" }),
  entity_type: z.string().min(1, { message: "Entity type is required" }),
  entity_name: z.string().min(1, { message: "Entity name is required" }),
  issue_date: z.date({ required_error: "Issue date is required" }),
  due_date: z.date({ required_error: "Due date is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  invoice_type: z.enum(["domestic", "foreign"]).optional(),
  invoice_category: z.enum(["automatic", "manual"]).optional(),
  calculation_reference: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
      description: z.string().min(1, { message: "Description is required" }),
      amount: z.coerce.number().min(0.01, { message: "Amount must be greater than 0" }),
    })
  ).min(1, { message: "At least one item is required" }),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceCreated?: () => void;
}

// Define a proper type for invoice items to avoid TypeScript errors
interface InvoiceItemType {
  id: string;
  description: string;
  amount: number;
}

const CreateInvoiceDialog = ({ open, onOpenChange, onInvoiceCreated }: CreateInvoiceDialogProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { createInvoice, isCreating } = useInvoiceMutations();
  const [items, setItems] = useState<InvoiceItemType[]>([{ id: nanoid(), description: "", amount: 0 }]);
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_number: "",
      entity_type: "client",
      entity_name: "",
      currency: "EUR",
      invoice_type: "domestic",
      invoice_category: "automatic",
      calculation_reference: "",
      notes: "",
      items: [{ id: nanoid(), description: "", amount: 0 }],
    },
  });

  const onSubmit = async (values: InvoiceFormValues) => {
    try {
      const totalAmount = values.items.reduce((sum, item) => sum + item.amount, 0);
      
      await createInvoice({
        invoice_number: values.invoice_number,
        entity_type: values.entity_type,
        entity_name: values.entity_name,
        issue_date: values.issue_date.toISOString(),
        due_date: values.due_date.toISOString(),
        currency: values.currency,
        invoice_type: values.invoice_type,
        invoice_category: values.invoice_category,
        calculation_reference: values.calculation_reference,
        total_amount: totalAmount,
        notes: values.notes,
        status: 'draft',
        invoice_items: values.items.map(item => ({
          description: item.description,
          amount: item.amount,
        })),
      });
      
      onOpenChange(false);
      form.reset();
      setItems([{ id: nanoid(), description: "", amount: 0 }]);
      
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
    }
  };

  const addItem = () => {
    const newItem: InvoiceItemType = { id: nanoid(), description: "", amount: 0 };
    const currentItems = form.getValues("items") || [];
    form.setValue("items", [...currentItems, newItem]);
    setItems(prevItems => [...prevItems, newItem]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length <= 1) return;
    
    const newItems = [...currentItems];
    newItems.splice(index, 1);
    form.setValue("items", newItems);
    setItems(newItems as InvoiceItemType[]);
  };

  const calculateTotal = () => {
    const items = form.getValues("items") || [];
    return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createInvoice")}</DialogTitle>
          <DialogDescription>{t("createInvoiceDescription")}</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="RSD">RSD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="invoice_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("invoiceType")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectInvoiceType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="domestic">{t("domestic")}</SelectItem>
                        <SelectItem value="foreign">{t("foreign")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="invoice_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("invoiceCategory")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectInvoiceCategory")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="automatic">{t("automatic")}</SelectItem>
                        <SelectItem value="manual">{t("manual")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="calculation_reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("calculationReference")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{t("invoiceItems")}</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-1" /> {t("addItem")}
                </Button>
              </div>
              
              {items.map((item, index) => (
                <div key={item.id} className="border rounded-md p-3 mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {t("item")} {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("itemDescription")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`items.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("amount")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              onChange={e => {
                                field.onChange(parseFloat(e.target.value) || 0);
                                form.trigger("items");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end text-sm mt-2">
                <div>
                  <span className="font-medium">{t("total")}:</span>{" "}
                  <span className="font-bold">
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: form.getValues("currency") || "EUR",
                    }).format(calculateTotal())}
                  </span>
                </div>
              </div>
              
              {form.formState.errors.items && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.items.message}
                </p>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notes")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("invoiceNotesDescription")}
                      className="resize-none"
                      rows={3}
                    />
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
              <Button type="submit" disabled={isCreating}>
                {isCreating ? t("creating") : t("createInvoice")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
