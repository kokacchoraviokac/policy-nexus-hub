
import { InvoiceType, InvoiceItem } from '@/types/finances';
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

export const generateInvoicePdf = async (invoice: InvoiceWithItems): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  
  // Configure fonts
  doc.setFont('helvetica');
  
  // Add company logo (normally you would add a real logo here)
  // doc.addImage('logo.png', 'PNG', margin, margin, 50, 20);
  
  // Add invoice header
  doc.setFontSize(22);
  doc.setTextColor(41, 98, 255); // Blue color for INVOICE title
  doc.text('INVOICE', margin, margin + 10);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`#${invoice.invoice_number}`, margin, margin + 20);
  
  // Company details (From)
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('From:', margin, margin + 35);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('Your Company Name', margin, margin + 45);
  doc.text('Your Company Address', margin, margin + 52);
  doc.text('Your Company City, Postal Code', margin, margin + 59);
  
  // Client details (To)
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('To:', pageWidth - margin - 100, margin + 35);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.entity_name, pageWidth - margin - 100, margin + 45);
  
  if (invoice.entity) {
    let yPos = margin + 52;
    
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
  
  // Invoice details
  const detailsX = margin;
  let detailsY = margin + 80;
  
  // Draw details box
  doc.setDrawColor(230, 230, 230);
  doc.setFillColor(250, 250, 250);
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
  detailsY += 40;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  doc.text('Invoice Type:', detailsX, detailsY + 10);
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.invoice_type ? invoice.invoice_type : 'domestic', detailsX + 60, detailsY + 10);
  
  doc.setTextColor(100, 100, 100);
  doc.text('Invoice Category:', detailsX, detailsY + 20);
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.invoice_category ? invoice.invoice_category : 'automatic', detailsX + 60, detailsY + 20);
  
  if (invoice.calculation_reference) {
    doc.setTextColor(100, 100, 100);
    doc.text('Calculation Ref:', detailsX, detailsY + 30);
    doc.setTextColor(0, 0, 0);
    doc.text(invoice.calculation_reference, detailsX + 60, detailsY + 30);
  }
  
  // Items table
  detailsY += 45;
  
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
    styles: { overflow: 'linebreak', cellWidth: 'auto' },
    headStyles: { fillColor: [41, 98, 255], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 40, halign: 'right' }
    },
    willDrawCell: (data: any) => {
      // Make the total row bold
      if (data.row.index === tableRows.length - 1) {
        doc.setFont('helvetica', 'bold');
      }
    },
    didDrawCell: (data: any) => {
      // Reset font
      if (data.row.index === tableRows.length - 1) {
        doc.setFont('helvetica', 'normal');
      }
    }
  });
  
  // Add notes if present
  if (invoice.notes) {
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Notes:', margin, finalY);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Handle multiline notes
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - (margin * 2));
    doc.text(splitNotes, margin, finalY + 10);
  }
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Invoice generated on ${formatDate(new Date())}`,
    margin,
    pageHeight - 20
  );
  
  // Return as blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};
