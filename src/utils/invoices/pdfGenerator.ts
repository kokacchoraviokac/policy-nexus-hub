import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvoiceType, InvoiceItem } from '@/types/finances';
import { formatCurrency, formatDate } from '@/utils/format';

// Define the template settings interface
export interface InvoiceTemplateSettings {
  name: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  font_size: string;
  font_weight?: 'normal' | 'bold' | 'light';
  font_style?: 'normal' | 'italic';
  logo_position: 'left' | 'center' | 'right';
  header_text: string;
  footer_text: string;
  payment_instructions: string;
  show_payment_instructions?: boolean;
  is_default: boolean;
}

// Generate PDF function
export const generateInvoicePdf = async (
  invoice: InvoiceType & { items: InvoiceItem[] },
  options?: {
    template?: InvoiceTemplateSettings;
    companyName?: string;
    companyAddress?: string;
    companyCity?: string;
    companyPostalCode?: string;
    companyCountry?: string;
    companyPhone?: string;
    customHeader?: string;
    customFooter?: string;
  }
): Promise<Blob> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  
  // Set fonts based on template
  const fontWeight = options?.template?.font_weight || 'normal';
  const fontStyle = options?.template?.font_style || 'normal';
  
  // Header section
  const headerY = margin;
  if (options?.template?.logo_position === 'left') {
    doc.text(options?.companyName || 'Your Company Name', margin, headerY);
  } else if (options?.template?.logo_position === 'center') {
    const textWidth = doc.getTextWidth(options?.companyName || 'Your Company Name');
    doc.text(options?.companyName || 'Your Company Name', pageWidth / 2 - textWidth / 2, headerY);
  } else {
    const textWidth = doc.getTextWidth(options?.companyName || 'Your Company Name');
    doc.text(options?.companyName || 'Your Company Name', pageWidth - margin - textWidth, headerY);
  }
  
  if (options?.customHeader) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const splitHeader = doc.splitTextToSize(options.customHeader, pageWidth - (margin * 2));
    doc.text(splitHeader, margin, headerY + 10);
  }
  
  const invoiceDetailsY = options?.customHeader ? headerY + 30 : headerY + 20;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice ${invoice.invoice_number}`, margin, invoiceDetailsY);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Issue Date: ${formatDate(new Date(invoice.issue_date))}`, margin, invoiceDetailsY + 10);
  doc.text(`Due Date: ${formatDate(new Date(invoice.due_date))}`, margin, invoiceDetailsY + 20);
  
  // Table rows for invoice items
  const tableRows = invoice.items.map(item => {
    let description = item.description;
    
    if (item.policy) {
      description = `${item.description}\nPolicy: ${item.policy.policy_number} - ${item.policy.policyholder_name}`;
    }
    
    return [description, formatCurrency(item.amount, invoice.currency)];
  });
  
  // Table rendering
  const startY = invoiceDetailsY + 30;
  autoTable(doc, {
    startY: startY,
    head: [['Description', 'Amount']],
    body: tableRows,
    margin: { horizontal: margin },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'right' }
    },
    didDrawPage: (data) => {
      // Footer section
      let footerText = options?.customFooter || 'Thank you for your business!';
      let nPages = doc.internal.getNumberOfPages();
      
      for (let i = 1; i <= nPages; i++) {
        if (i > 1) {
          doc.setPage(i);
        }
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        
        const splitFooter = doc.splitTextToSize(footerText, pageWidth - (margin * 2));
        const textWidth = doc.getTextWidth(`${i} / ${nPages}`);
        
        doc.text(splitFooter, margin, doc.internal.pageSize.height - 20);
        doc.text(`${i} / ${nPages}`, pageWidth - margin - textWidth, doc.internal.pageSize.height - 20);
      }
    }
  });
  
  const finalY = doc.lastAutoTable?.finalY || 150;
  
  // Total amount section
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total: ${formatCurrency(invoice.total_amount, invoice.currency)}`, margin, finalY + 20, { align: 'right' });
  
  // Notes section
  if (invoice.notes) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Notes:', margin, finalY + 30);
    
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - (margin * 2));
    doc.text(splitNotes, margin, finalY + 40);
  }
  
  // Payment instructions section
  if (options?.template?.payment_instructions && options?.template?.show_payment_instructions) {
    const paymentY = invoice.notes ? finalY + 30 : finalY;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Payment Instructions:', margin, paymentY);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Handle multiline payment instructions
    const splitInstructions = doc.splitTextToSize(
      options.template.payment_instructions, 
      pageWidth - (margin * 2)
    );
    doc.text(splitInstructions, margin, paymentY + 10);
  }
  
  return doc.output('blob');
};

// Function to get invoice template
export const getInvoiceTemplate = async (companyId: string): Promise<InvoiceTemplateSettings | null> => {
  try {
    // This is a stub - you would implement actual template fetching here
    // Example of connecting to your backend
    const response = await fetch(`/api/invoice-templates/default?companyId=${companyId}`);
    if (!response.ok) return null;
    return await response.json() as InvoiceTemplateSettings;
  } catch (error) {
    console.error("Error fetching invoice template:", error);
    return null;
  }
};

// Function to get company info
export const getCompanyInfo = async (companyId: string): Promise<any> => {
  try {
    // This is a stub - you would implement actual company info fetching here
    // Example of connecting to your backend
    const response = await fetch(`/api/companies/${companyId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching company info:", error);
    return null;
  }
};
