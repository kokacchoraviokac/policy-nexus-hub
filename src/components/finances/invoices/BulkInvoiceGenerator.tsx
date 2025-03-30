
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Check, CalendarIcon, Receipt, X } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { nanoid } from 'nanoid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { CommissionType } from '@/types/finances';

interface BulkInvoiceGeneratorProps {
  onGenerationComplete?: () => void;
}

const BulkInvoiceGenerator = ({ onGenerationComplete }: BulkInvoiceGeneratorProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)));
  const [insurer, setInsurer] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string>("due");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch insurers
  const { data: insurers, isLoading: isLoadingInsurers } = useQuery({
    queryKey: ['insurers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurers')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  // Fetch eligible commissions for invoicing
  const { data: commissions, isLoading: isLoadingCommissions } = useQuery({
    queryKey: ['commissions-for-invoicing', status, insurer, dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase
        .from('commissions')
        .select(`
          id,
          policy_id,
          base_amount,
          rate,
          calculated_amount,
          payment_date,
          status,
          policies:policy_id(
            id,
            policy_number,
            policyholder_name,
            insurer_id,
            insurer_name
          )
        `)
        .eq('status', status);
      
      if (insurer) {
        query = query.eq('policies.insurer_id', insurer);
      }
      
      if (dateFrom) {
        query = query.gte('created_at', dateFrom.toISOString());
      }
      
      if (dateTo) {
        query = query.lte('created_at', dateTo.toISOString());
      }

      // Filter out commissions that already have invoices
      const { data: commissions, error: commissionsError } = await query;
      
      if (commissionsError) throw commissionsError;
      
      if (!commissions || commissions.length === 0) return [];
      
      // Get commission IDs that are already linked to invoices
      const commissionIds = commissions.map(c => c.id);
      
      const { data: invoiceItems, error: invoiceItemsError } = await supabase
        .from('invoice_items')
        .select('commission_id')
        .in('commission_id', commissionIds);
      
      if (invoiceItemsError) throw invoiceItemsError;
      
      // Filter out commissions that already have invoices
      const invoicedCommissionIds = new Set((invoiceItems || []).map(item => item.commission_id));
      
      return commissions.filter(commission => !invoicedCommissionIds.has(commission.id));
    },
    enabled: isOpen && !!status,
  });

  // Mutation to create invoices in bulk
  const createBulkInvoices = useMutation({
    mutationFn: async () => {
      if (!selectedCommissions || selectedCommissions.length === 0) {
        throw new Error("No commissions selected");
      }
      
      // Group selected commissions by insurer
      const commissionsByInsurer: Record<string, typeof commissions> = {};
      
      selectedCommissions.forEach(commissionId => {
        const commission = commissions?.find(c => c.id === commissionId);
        if (commission && commission.policies) {
          const insurerId = commission.policies.insurer_id;
          const insurerName = commission.policies.insurer_name;
          
          if (!commissionsByInsurer[insurerId]) {
            commissionsByInsurer[insurerId] = [];
          }
          
          commissionsByInsurer[insurerId].push(commission);
        }
      });
      
      // Create one invoice per insurer
      const invoicePromises = Object.entries(commissionsByInsurer).map(async ([insurerId, insurerCommissions]) => {
        if (!insurerCommissions || insurerCommissions.length === 0) return null;
        
        const invoiceNumber = `INV-${new Date().getTime().toString().slice(-6)}-${nanoid(4)}`;
        const insurerName = insurerCommissions[0].policies?.insurer_name || "Unknown Insurer";
        
        // Calculate total amount
        const totalAmount = insurerCommissions.reduce((sum, commission) => sum + Number(commission.calculated_amount), 0);
        
        // Create invoice
        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            invoice_number: invoiceNumber,
            entity_type: 'insurer',
            entity_name: insurerName,
            entity_id: insurerId,
            issue_date: invoiceDate.toISOString(),
            due_date: dueDate.toISOString(),
            total_amount: totalAmount,
            status: 'draft',
            currency: 'EUR',
            invoice_type: 'domestic',
            invoice_category: 'automatic',
            calculation_reference: `BULK-${format(new Date(), 'yyyyMMdd')}`,
            notes: `Automatically generated invoice for commissions from ${insurerName}`
          })
          .select('id')
          .single();
        
        if (invoiceError) throw invoiceError;
        
        // Create invoice items
        const invoiceItems = insurerCommissions.map(commission => ({
          invoice_id: invoice.id,
          description: `Commission for policy ${commission.policies?.policy_number} - ${commission.policies?.policyholder_name}`,
          amount: commission.calculated_amount,
          policy_id: commission.policy_id,
          commission_id: commission.id
        }));
        
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(invoiceItems);
        
        if (itemsError) throw itemsError;
        
        return invoice;
      });
      
      return Promise.all(invoicePromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['commissions-for-invoicing'] });
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      
      toast({
        title: t("invoicesCreated"),
        description: t("bulkInvoicesCreatedSuccess"),
      });
      
      setSelectedCommissions([]);
      setIsOpen(false);
      
      if (onGenerationComplete) {
        onGenerationComplete();
      }
    },
    onError: (error) => {
      console.error("Error creating bulk invoices:", error);
      toast({
        title: t("errorCreatingInvoices"),
        description: t("errorCreatingBulkInvoicesDescription"),
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  const handleGenerateInvoices = () => {
    if (selectedCommissions.length === 0) {
      toast({
        title: t("noCommissionsSelected"),
        description: t("selectAtLeastOneCommission"),
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    createBulkInvoices.mutate();
  };

  const toggleSelectAll = () => {
    if (selectedCommissions.length === (commissions?.length || 0)) {
      setSelectedCommissions([]);
    } else {
      setSelectedCommissions(commissions?.map(c => c.id) || []);
    }
  };

  const toggleCommissionSelection = (commissionId: string) => {
    if (selectedCommissions.includes(commissionId)) {
      setSelectedCommissions(selectedCommissions.filter(id => id !== commissionId));
    } else {
      setSelectedCommissions([...selectedCommissions, commissionId]);
    }
  };

  const calculateTotalAmount = () => {
    if (!commissions) return 0;
    
    return commissions
      .filter(c => selectedCommissions.includes(c.id))
      .reduce((sum, commission) => sum + Number(commission.calculated_amount), 0);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Receipt className="h-4 w-4 mr-2" />
          {t("bulkGenerateInvoices")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-xl w-full">
        <SheetHeader>
          <SheetTitle>{t("bulkInvoiceGeneration")}</SheetTitle>
          <SheetDescription>
            {t("bulkInvoiceGenerationDescription")}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("invoiceSettings")}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("issueDate")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      {invoiceDate ? (
                        format(invoiceDate, "PPP")
                      ) : (
                        <span>{t("selectDate")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={invoiceDate}
                      onSelect={(date) => date && setInvoiceDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>{t("dueDate")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      {dueDate ? (
                        format(dueDate, "PPP")
                      ) : (
                        <span>{t("selectDate")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => date && setDueDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("commissionFilters")}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("status")}</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="due">{t("due")}</SelectItem>
                    <SelectItem value="calculating">{t("calculating")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>{t("insurer")}</Label>
                <Select value={insurer} onValueChange={setInsurer}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectInsurer")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("all")}</SelectItem>
                    {insurers?.map((insurer) => (
                      <SelectItem key={insurer.id} value={insurer.id}>
                        {insurer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>{t("dateFrom")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      {dateFrom ? (
                        format(dateFrom, "PPP")
                      ) : (
                        <span>{t("selectDate")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>{t("dateTo")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      {dateTo ? (
                        format(dateTo, "PPP")
                      ) : (
                        <span>{t("selectDate")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{t("eligibleCommissions")}</h3>
              {commissions && commissions.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleSelectAll}
                >
                  {selectedCommissions.length === commissions.length ? (
                    <>{t("deselectAll")}</>
                  ) : (
                    <>{t("selectAll")}</>
                  )}
                </Button>
              )}
            </div>
            
            <div className="border rounded-md h-[250px] overflow-y-auto">
              {isLoadingCommissions ? (
                <div className="p-4 text-center text-muted-foreground">
                  {t("loadingCommissions")}
                </div>
              ) : commissions && commissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead>{t("policy")}</TableHead>
                      <TableHead>{t("insurer")}</TableHead>
                      <TableHead className="text-right">{t("commission")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell className="px-2">
                          <Checkbox
                            checked={selectedCommissions.includes(commission.id)}
                            onCheckedChange={() => toggleCommissionSelection(commission.id)}
                          />
                        </TableCell>
                        <TableCell>
                          {commission.policies?.policy_number} - {commission.policies?.policyholder_name}
                        </TableCell>
                        <TableCell>
                          {commission.policies?.insurer_name}
                        </TableCell>
                        <TableCell className="text-right">
                          {commission.calculated_amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  {t("noEligibleCommissions")}
                </div>
              )}
            </div>
            
            {selectedCommissions.length > 0 && (
              <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                <span className="text-sm font-medium">{t("selectedCommissions")}: {selectedCommissions.length}</span>
                <span className="text-sm font-medium">
                  {t("total")}: {calculateTotalAmount().toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} EUR
                </span>
              </div>
            )}
          </div>
        </div>
        
        <SheetFooter className="mt-6">
          <div className="flex justify-between w-full">
            <SheetClose asChild>
              <Button variant="outline">
                <X className="h-4 w-4 mr-2" />
                {t("cancel")}
              </Button>
            </SheetClose>
            
            <Button
              onClick={handleGenerateInvoices}
              disabled={selectedCommissions.length === 0 || isGenerating}
            >
              {isGenerating ? (
                <>{t("generating")}</>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t("generateInvoices")}
                </>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BulkInvoiceGenerator;
