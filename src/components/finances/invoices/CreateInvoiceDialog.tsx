
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { nanoid } from 'nanoid';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useInvoiceMutations } from '@/hooks/finances/useInvoiceMutations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InvoiceItemsTable from './InvoiceItemsTable';
import { InvoiceItem } from '@/types/finances';

// Define proper types for invoice items input
interface InvoiceItemInput {
  id: string;
  description: string;
  amount: number;
  policy_id?: string;
  policy?: {
    policy_number?: string;
    policyholder_name?: string;
  };
}

const invoiceSchema = z.object({
  invoice_number: z.string().min(1, { message: "Invoice number is required" }),
  entity_type: z.string().min(1, { message: "Entity type is required" }),
  entity_name: z.string().min(1, { message: "Entity name is required" }),
  issue_date: z.date(),
  due_date: z.date(),
  currency: z.string().min(1, { message: "Currency is required" }),
  items: z.array(
    z.object({
      id: z.string(),
      description: z.string().min(1, { message: "Description is required" }),
      amount: z.number().min(0.01, { message: "Amount must be greater than 0" }),
      policy_id: z.string().optional(),
    })
  ).min(1, { message: "At least one item is required" }),
  invoice_type: z.enum(['domestic', 'foreign']),
  invoice_category: z.enum(['automatic', 'manual']),
  calculation_reference: z.string().optional(),
  notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceCreated?: () => void;
}

const CreateInvoiceDialog = ({ open, onOpenChange, onInvoiceCreated }: CreateInvoiceDialogProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { createInvoice, isCreating } = useInvoiceMutations();
  const [items, setItems] = useState<InvoiceItemInput[]>([{ 
    id: nanoid(), 
    description: "", 
    amount: 0 
  }]);
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_number: `INV-${new Date().getTime().toString().slice(-6)}`,
      entity_type: "client",
      entity_name: "",
      issue_date: new Date(),
      due_date: new Date(new Date().setDate(new Date().getDate() + 30)),
      currency: "EUR",
      items: [{ id: nanoid(), description: "", amount: 0 }],
      invoice_type: "domestic",
      invoice_category: "automatic",
      calculation_reference: "",
      notes: "",
    },
  });
  
  // Update form items when state items change
  useEffect(() => {
    form.setValue("items", items);
  }, [items, form]);
  
  const onSubmit = (values: InvoiceFormValues) => {
    // Calculate total amount
    const totalAmount = values.items.reduce((sum, item) => sum + item.amount, 0);
    
    createInvoice({
      invoice_number: values.invoice_number,
      entity_type: values.entity_type,
      entity_name: values.entity_name,
      issue_date: values.issue_date.toISOString(),
      due_date: values.due_date.toISOString(),
      currency: values.currency,
      total_amount: totalAmount,
      notes: values.notes,
      status: 'draft',
      invoice_items: values.items.map(item => ({
        id: item.id,
        description: item.description,
        amount: item.amount,
        policy_id: item.policy_id
      })),
      invoice_type: values.invoice_type,
      invoice_category: values.invoice_category,
      calculation_reference: values.calculation_reference
    });
    
    // Close dialog and notify parent
    onOpenChange(false);
    if (onInvoiceCreated) {
      onInvoiceCreated();
    }
  };
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        invoice_number: `INV-${new Date().getTime().toString().slice(-6)}`,
        entity_type: "client",
        entity_name: "",
        issue_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)),
        currency: "EUR",
        items: [{ id: nanoid(), description: "", amount: 0 }],
        invoice_type: "domestic",
        invoice_category: "automatic",
        calculation_reference: "",
        notes: "",
      });
      setItems([{ id: nanoid(), description: "", amount: 0 }]);
    }
  }, [open, form]);
  
  const calculateTotal = () => {
    const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);
    return totalAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("createInvoice")}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <FormField
                control={form.control}
                name="issue_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("issueDate")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
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
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("dueDate")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
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
            </div>
            
            <div className="space-y-4">
              <InvoiceItemsTable 
                items={items}
                onItemsChange={setItems}
                onCalculateTotal={() => {
                  form.trigger("items");
                }}
              />
              
              <div className="flex justify-end">
                <div className="bg-muted rounded p-2">
                  <span className="font-medium mr-2">{t("total")}:</span>
                  <span>{calculateTotal()} {form.getValues("currency")}</span>
                </div>
              </div>
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
                      rows={3}
                      placeholder={t("invoiceNotesDescription")}
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
              <Button 
                type="submit" 
                disabled={isCreating}
              >
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
