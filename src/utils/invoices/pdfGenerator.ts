import { InvoiceType, InvoiceItem, InvoiceTemplateSettings } from '@/types/finances';
import { formatCurrency, formatDate } from '@/utils/format';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

interface GeneratePdfOptions {
  template?: InvoiceTemplateSettings;
  companyName?: string;
  companyAddress?: string;
  companyCity?: string;
  companyPostalCode?: string;
  companyCountry?: string;
  companyPhone?: string;
  companyLogoUrl?: string;
  customFooter?: string;
  customHeader?: string;
}

export const generateInvoicePdf = async (
  invoice: InvoiceWithItems, 
  options: GeneratePdfOptions = {}
): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  
  // Extract settings from options or use defaults
  const {
    template,
    companyName = 'Your Company Name',
    companyAddress = 'Your Company Address',
    companyCity = 'Your Company City',
    companyPostalCode = 'Your Postal Code',
    companyCountry = 'Your Country',
    companyPhone,
    companyLogoUrl,
    customFooter,
    customHeader
  } = options;
  
  // Set color scheme based on template or default to blue
  const primaryColor = template?.primary_color || [41, 98, 255]; // RGB array for blue
  const secondaryColor = template?.secondary_color || [245, 247, 250]; // Light blue/gray
  const fontFamily = template?.font_family || 'helvetica';
  
  // Parse string colors to RGB arrays if needed
  const getPrimaryColorRGB = (): number[] => {
    if (Array.isArray(primaryColor)) return primaryColor;
    if (typeof primaryColor === 'string' && primaryColor.startsWith('#')) {
      const r = parseInt(primaryColor.slice(1, 3), 16);
      const g = parseInt(primaryColor.slice(3, 5), 16);
      const b = parseInt(primaryColor.slice(5, 7), 16);
      return [r, g, b];
    }
    return [41, 98, 255]; // Default blue
  };
  
  // Configure fonts
  doc.setFont(fontFamily);
  
  // Add custom header if provided
  if (customHeader || template?.header_text) {
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(customHeader || template?.header_text || '', pageWidth / 2, 10, { align: 'center' });
  }
  
  // Add company logo
  if (companyLogoUrl) {
    // In a real implementation, you would load the image and add it
    // For this example, we'll simulate a logo with a colored rectangle
    doc.setFillColor(...getPrimaryColorRGB());
    doc.rect(margin, margin, 40, 15, 'F');
    
    // Add placeholder text for logo
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('LOGO', margin + 20, margin + 10, { align: 'center' });
  }
  
  // Add invoice header
  const headerY = companyLogoUrl ? margin + 25 : margin + 10;
  doc.setFontSize(22);
  doc.setTextColor(...getPrimaryColorRGB());
  doc.text('INVOICE', margin, headerY);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`#${invoice.invoice_number}`, margin, headerY + 10);
  
  // Company details (From)
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('From:', margin, headerY + 25);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(companyName, margin, headerY + 35);
  doc.text(companyAddress, margin, headerY + 42);
  doc.text(`${companyCity}, ${companyPostalCode}`, margin, headerY + 49);
  doc.text(companyCountry, margin, headerY + 56);
  
  if (companyPhone) {
    doc.text(`Tel: ${companyPhone}`, margin, headerY + 63);
  }
  
  // Client details (To)
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('To:', pageWidth - margin - 100, headerY + 25);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.entity_name, pageWidth - margin - 100, headerY + 35);
  
  if (invoice.entity) {
    let yPos = headerY + 42;
    
    if (invoice.entity.address) {
      doc.text(invoice.entity.address, pageWidth - margin - 100, yPos);
      yPos += 7;
    }
    
    let locationLine = '';
    if (invoice.entity.city) {
      locationLine += invoice.entity.city;
    }
    
    if (invoice.entity.city && invoice.entity.postal_code) {
      locationLine += ', ';
    }
    
    if (invoice.entity.postal_code) {
      locationLine += invoice.entity.postal_code;
    }
    
    if (locationLine) {
      doc.text(locationLine, pageWidth - margin - 100, yPos);
      yPos += 7;
    }
    
    if (invoice.entity.country) {
      doc.text(invoice.entity.country, pageWidth - margin - 100, yPos);
    }
  }
  
  // Invoice details box - start position
  let detailsY = headerY + 75;
  // Define column positions for details section
  const detailsX = margin;
  
  // Draw details box
  doc.setDrawColor(230, 230, 230);
  doc.setFillColor(...secondaryColor);
  doc.roundedRect(margin, detailsY, pageWidth - (margin * 2), 40, 3, 3, 'FD');
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  // Col 1
  doc.text('Issue Date:', detailsX + 10, detailsY + 12);
  doc.setTextColor(0, 0, 0);
  doc.text(formatDate(new Date(invoice.issue_date)), detailsX + 10, detailsY + 22);
  
  // Col 2
  doc.setTextColor(100, 100, 100);
  doc.text('Due Date:', detailsX + 80, detailsY + 12);
  doc.setTextColor(0, 0, 0);
  doc.text(formatDate(new Date(invoice.due_date)), detailsX + 80, detailsY + 22);
  
  // Col 3
  doc.setTextColor(100, 100, 100);
  doc.text('Status:', detailsX + 150, detailsY + 12);
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.status.toUpperCase(), detailsX + 150, detailsY + 22);
  
  // Add additional fields based on requirements
  detailsY += 50;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  doc.text('Invoice Type:', detailsX, detailsY);
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.invoice_type ? invoice.invoice_type : 'domestic', detailsX + 60, detailsY);
  
  doc.setTextColor(100, 100, 100);
  doc.text('Invoice Category:', detailsX, detailsY + 10);
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.invoice_category ? invoice.invoice_category : 'automatic', detailsX + 60, detailsY + 10);
  
  if (invoice.calculation_reference) {
    doc.setTextColor(100, 100, 100);
    doc.text('Calculation Ref:', detailsX, detailsY + 20);
    doc.setTextColor(0, 0, 0);
    doc.text(invoice.calculation_reference, detailsX + 60, detailsY + 20);
  }
  
  // Items table
  detailsY += 35;
  
  // Set colors for table header
  const tableHeadColor = getPrimaryColorRGB();
  
  // Prepare table data
  const tableColumn = ["Description", "Amount"];
  const tableRows = invoice.items.map(item => {
    const description = item.policy ? 
      `${item.description}\nPolicy: ${item.policy?.policy_number} - ${item.policy?.policyholder_name}` : 
      item.description;
    
    return [description, formatCurrency(item.amount, invoice.currency)];
  });
  
  // Add total row
  tableRows.push([
    "Total",
    formatCurrency(invoice.total_amount, invoice.currency)
  ]);
  
  // Add items table
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: detailsY,
    styles: { 
      overflow: 'linebreak', 
      cellWidth: 'auto',
      font: fontFamily
    },
    headStyles: { 
      fillColor: tableHeadColor, 
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 40, halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    willDrawCell: (data: any) => {
      // Make the total row bold
      if (data.row.index === tableRows.length - 1) {
        doc.setFont(fontFamily, 'bold');
      }
    },
    didDrawCell: (data: any) => {
      // Reset font
      if (data.row.index === tableRows.length - 1) {
        doc.setFont(fontFamily, 'normal');
      }
    }
  });
  
  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  // Add notes if present
  if (invoice.notes) {
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Notes:', margin, finalY);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Handle multiline notes
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - (margin * 2));
    doc.text(splitNotes, margin, finalY + 10);
  }
  
  // Add payment instructions if enabled in template
  if (template?.show_payment_instructions && template?.payment_instructions) {
    const paymentY = invoice.notes ? finalY + 30 : finalY;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Payment Instructions:', margin, paymentY);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Handle multiline payment instructions
    const splitInstructions = doc.splitTextToSize(
      template.payment_instructions, 
      pageWidth - (margin * 2)
    );
    doc.text(splitInstructions, margin, paymentY + 10);
  }
  
  // Add custom footer if provided
  const footerText = customFooter || template?.footer_text || 
    `Invoice generated on ${formatDate(new Date())}`;
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    footerText,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
  
  // Return as blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};

// Helper function to get invoice template settings from the database
export const getInvoiceTemplate = async (
  companyId: string, 
  templateId?: string
): Promise<InvoiceTemplateSettings | null> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // If templateId is provided, fetch that specific template
    if (templateId) {
      const { data, error } = await supabase
        .from('invoice_templates')
        .select('*')
        .eq('id', templateId)
        .eq('company_id', companyId)
        .single();
        
      if (error || !data) return null;
      return data as unknown as InvoiceTemplateSettings;
    }
    
    // Otherwise, fetch the default template
    const { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_default', true)
      .single();
      
    if (error || !data) return null;
    return data as unknown as InvoiceTemplateSettings;
  } catch (error) {
    console.error('Error fetching invoice template:', error);
    return null;
  }
};

// Helper function to get company information from the database
export const getCompanyInfo = async (companyId: string): Promise<any> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();
      
    if (error || !data) return {};
    return data;
  } catch (error) {
    console.error('Error fetching company info:', error);
    return {};
  }
};
