
import React, { useState } from "react";
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
import { InvoiceType } from "@/types/finances";
import UpdateInvoiceStatusDialog from "@/components/finances/invoices/UpdateInvoiceStatusDialog";

interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  amount: number;
  policy_id?: string;
  commission_id?: string;
  created_at: string;
  updated_at: string;
}

interface InvoiceWithItems extends InvoiceType {
  items: InvoiceItem[];
}

const InvoiceDetail = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  
  const { data: invoice, isLoading, isError, refetch } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      // First, get the invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();
      
      if (invoiceError) throw invoiceError;
      
      // Then, get the invoice items
      const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .select('*')
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
  
  const handlePrintInvoice = () => {
    // Print functionality would be implemented here
    toast({
      title: t("printingInvoice"),
      description: t("preparingForPrint"),
    });
  };
  
  const handleDownloadPdf = () => {
    // PDF download functionality would be implemented here
    toast({
      title: t("downloadStarted"),
      description: t("preparingPdfDownload"),
    });
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
            {t("invoice")} {invoice.invoice_number}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handlePrintInvoice}
          >
            <Printer className="h-4 w-4 mr-2" />
            {t("print")}
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
          >
            <FileText className="h-4 w-4 mr-2" />
            {t("downloadPdf")}
          </Button>
          <Button 
            size="sm"
            onClick={() => setStatusDialogOpen(true)}
          >
            {t("updateStatus")}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{t("invoiceDetails")}</CardTitle>
              <CardDescription>
                {t("issuedOn")} {formatDate(new Date(invoice.issue_date))}
              </CardDescription>
            </div>
            <div>{getStatusBadge(invoice.status)}</div>
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
              <p className="font-medium">{invoice.entity_name}</p>
              <p>{t("entityType")}: {t(invoice.entity_type || 'other')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">
                {t("invoiceNumber")}
              </h3>
              <p>{invoice.invoice_number}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">
                {t("issueDate")}
              </h3>
              <p>{formatDate(new Date(invoice.issue_date))}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">
                {t("dueDate")}
              </h3>
              <p>{formatDate(new Date(invoice.due_date))}</p>
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
              
              {invoice.items.map((item, index) => (
                <React.Fragment key={item.id || index}>
                  <div className="grid grid-cols-12 p-3 text-sm">
                    <div className="col-span-6">{item.description}</div>
                    <div className="col-span-6 text-right">
                      {formatCurrency(item.amount, invoice.currency)}
                    </div>
                  </div>
                  {index < invoice.items.length - 1 && <Separator />}
                </React.Fragment>
              ))}
              
              <Separator />
              <div className="grid grid-cols-12 p-3 font-medium">
                <div className="col-span-6">{t("total")}</div>
                <div className="col-span-6 text-right">
                  {formatCurrency(invoice.total_amount, invoice.currency)}
                </div>
              </div>
            </div>
          </div>
          
          {invoice.notes && (
            <div className="mt-4">
              <h3 className="font-medium mb-1">{t("notes")}</h3>
              <p className="text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/20 flex-col items-start">
          <p className="text-sm text-muted-foreground">
            {t("createdAt")}: {formatDate(new Date(invoice.created_at))}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("lastUpdated")}: {formatDate(new Date(invoice.updated_at))}
          </p>
        </CardFooter>
      </Card>
      
      <UpdateInvoiceStatusDialog 
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        invoiceId={invoice.id}
        currentStatus={invoice.status}
        onStatusUpdated={refetch}
      />
    </div>
  );
};

export default InvoiceDetail;
