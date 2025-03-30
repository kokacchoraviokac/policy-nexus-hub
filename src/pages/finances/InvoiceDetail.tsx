import React, { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Printer, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/format";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { InvoiceType, InvoiceItem } from "@/types/finances";
import UpdateInvoiceStatusDialog from "@/components/finances/invoices/UpdateInvoiceStatusDialog";
import { useReactToPrint } from "@/hooks/finances/useReactToPrint";
import { generateInvoicePdf } from "@/utils/invoices/pdfGenerator";

interface InvoiceWithItems extends InvoiceType {
  items: InvoiceItem[];
  entity?: {
    name?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
}

const InvoiceDetail = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  const { data: invoice, isLoading, isError, refetch } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      // First, get the invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select(`
          *,
          entity:entity_id(name, address, city, postal_code, country)
        `)
        .eq('id', invoiceId)
        .single();
      
      if (invoiceError) throw invoiceError;
      
      // Then, get the invoice items
      const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .select(`
          *,
          policy:policy_id(policy_number, policyholder_name),
          commission:commission_id(policy_id, calculated_amount)
        `)
        .eq('invoice_id', invoiceId);
      
      if (itemsError) throw itemsError;
      
      return { 
        ...invoiceData,
        items: itemsData || []
      } as InvoiceWithItems;
    },
  });
  
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status) {
      case 'draft':
        variant = "secondary";
        break;
      case 'issued':
        variant = "default";
        break;
      case 'paid':
        variant = "outline";
        break;
      case 'cancelled':
        variant = "destructive";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant}>
        {t(status)}
      </Badge>
    );
  };
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${invoice?.invoice_number || ''}`,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 200);
      });
    },
    onAfterPrint: () => {
      setIsPrinting(false);
      toast({
        title: t("printSuccess"),
        description: t("invoicePrintedSuccessfully"),
      });
    },
  });
  
  const handleDownloadPdf = async () => {
    if (!invoice) return;
    
    try {
      toast({
        title: t("generatingPdf"),
        description: t("preparingPdfDownload"),
      });
      
      const pdfBlob = await generateInvoicePdf(invoice);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: t("pdfGenerated"),
        description: t("pdfDownloadStarted"),
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: t("errorGeneratingPdf"),
        description: t("errorGeneratingPdfDescription"),
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Link 
            to="/finances/invoicing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Skeleton className="h-8 w-48" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isError || !invoice) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-2 mb-4">
          <Link 
            to="/finances/invoicing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{t("invoiceNotFound")}</h1>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("invoiceNotFound")}</h2>
            <p className="text-muted-foreground mb-6">{t("invoiceNotFoundDescription")}</p>
            <Button asChild>
              <Link to="/finances/invoicing">{t("backToInvoices")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link 
            to="/finances/invoicing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("invoice")} {invoice?.invoice_number}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handlePrint}
            disabled={isPrinting || isLoading || isError}
          >
            <Printer className="h-4 w-4 mr-2" />
            {isPrinting ? t("printing") : t("print")}
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isLoading || isError}
          >
            <FileText className="h-4 w-4 mr-2" />
            {t("downloadPdf")}
          </Button>
          <Button 
            size="sm"
            onClick={() => setStatusDialogOpen(true)}
            disabled={isLoading || isError}
          >
            {t("updateStatus")}
          </Button>
        </div>
      </div>
      
      <div ref={printRef} className={`${isPrinting ? 'bg-white text-black' : ''}`}>
        <Card className={isPrinting ? 'shadow-none border-0' : ''}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{t("invoiceDetails")}</CardTitle>
                <CardDescription>
                  {t("issuedOn")} {invoice && formatDate(new Date(invoice.issue_date))}
                </CardDescription>
              </div>
              <div>{invoice && getStatusBadge(invoice.status)}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  {t("from")}
                </h3>
                <p className="font-medium">Your Company Name</p>
                <p>Your Company Address</p>
                <p>Your Company City, Postal Code</p>
                <p>Your Company Country</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  {t("to")}
                </h3>
                <p className="font-medium">{invoice?.entity_name}</p>
                <p>{t("entityType")}: {invoice && t(invoice.entity_type || 'other')}</p>
                {invoice?.entity && (
                  <>
                    {invoice.entity.address && <p>{invoice.entity.address}</p>}
                    {(invoice.entity.city || invoice.entity.postal_code) && (
                      <p>
                        {invoice.entity.city}{invoice.entity.city && invoice.entity.postal_code && ', '}
                        {invoice.entity.postal_code}
                      </p>
                    )}
                    {invoice.entity.country && <p>{invoice.entity.country}</p>}
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  {t("invoiceNumber")}
                </h3>
                <p>{invoice?.invoice_number}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  {t("issueDate")}
                </h3>
                <p>{invoice && formatDate(new Date(invoice.issue_date))}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  {t("dueDate")}
                </h3>
                <p>{invoice && formatDate(new Date(invoice.due_date))}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  {t("invoiceType")}
                </h3>
                <p>{invoice?.invoice_type ? t(invoice.invoice_type) : t("domestic")}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  {t("invoiceCategory")}
                </h3>
                <p>{invoice?.invoice_category ? t(invoice.invoice_category) : t("automatic")}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  {t("calculationReference")}
                </h3>
                <p>{invoice?.calculation_reference || '-'}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">{t("invoiceItems")}</h3>
              <div className="border rounded-md">
                <div className="grid grid-cols-12 p-3 bg-muted/50 text-sm font-medium">
                  <div className="col-span-6">{t("description")}</div>
                  <div className="col-span-6 text-right">{t("amount")}</div>
                </div>
                <Separator />
                
                {invoice?.items.map((item, index) => (
                  <React.Fragment key={item.id || index}>
                    <div className="grid grid-cols-12 p-3 text-sm">
                      <div className="col-span-6">
                        {item.description}
                        {item.policy && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {t("policy")}: {item.policy.policy_number} - {item.policy.policyholder_name}
                          </div>
                        )}
                      </div>
                      <div className="col-span-6 text-right">
                        {invoice && formatCurrency(item.amount, invoice.currency)}
                      </div>
                    </div>
                    {index < (invoice?.items.length || 0) - 1 && <Separator />}
                  </React.Fragment>
                ))}
                
                <Separator />
                <div className="grid grid-cols-12 p-3 font-medium">
                  <div className="col-span-6">{t("total")}</div>
                  <div className="col-span-6 text-right">
                    {invoice && formatCurrency(invoice.total_amount, invoice.currency)}
                  </div>
                </div>
              </div>
            </div>
            
            {invoice?.notes && (
              <div className="mt-4">
                <h3 className="font-medium mb-1">{t("notes")}</h3>
                <p className="text-muted-foreground">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/20 flex-col items-start">
            <p className="text-sm text-muted-foreground">
              {t("createdAt")}: {invoice && formatDate(new Date(invoice.created_at))}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("lastUpdated")}: {invoice && formatDate(new Date(invoice.updated_at))}
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {invoice && (
        <UpdateInvoiceStatusDialog 
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          invoiceId={invoice.id}
          currentStatus={invoice.status}
          onStatusUpdated={refetch}
        />
      )}
    </div>
  );
};

export default InvoiceDetail;
