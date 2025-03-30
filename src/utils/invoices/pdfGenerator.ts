
import { InvoiceType } from '@/types/finances';
import { formatCurrency, formatDate } from '@/utils/format';

interface InvoiceWithItems extends InvoiceType {
  items: any[];
  entity?: any;
}

export const generateInvoicePdf = async (invoice: InvoiceWithItems): Promise<Blob> => {
  // In a real implementation, you would use a library like jsPDF or pdfmake
  // For this example, we'll create a simple HTML-based PDF using browser's print-to-PDF
  
  // Create a temporary iframe to render the invoice
  const iframe = document.createElement('iframe');
  iframe.style.visibility = 'hidden';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  document.body.appendChild(iframe);
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) throw new Error('Failed to create PDF document');
  
  // Create PDF content
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoice_number}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        h1 {
          color: #2563eb;
          margin: 0;
        }
        .address-block {
          margin-bottom: 20px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .invoice-details div {
          flex: 1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        table th {
          text-align: left;
          background: #f3f4f6;
          padding: 10px;
        }
        table td {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        .total-row td {
          font-weight: bold;
          border-top: 2px solid #e5e7eb;
        }
        .text-right {
          text-align: right;
        }
        .notes {
          margin-top: 30px;
          padding: 15px;
          background: #f9fafb;
          border-radius: 5px;
        }
        .footer {
          margin-top: 50px;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div>
          <h1>INVOICE</h1>
          <p>#${invoice.invoice_number}</p>
        </div>
        <div>
          <p><strong>Your Company Name</strong></p>
          <p>Your Company Address</p>
          <p>Your Company City, Postal Code</p>
        </div>
      </div>
      
      <div class="invoice-details">
        <div class="address-block">
          <p><strong>Bill To:</strong></p>
          <p>${invoice.entity_name}</p>
          ${invoice.entity ? `
          <p>${invoice.entity.address || ''}</p>
          <p>${invoice.entity.city || ''} ${invoice.entity.postal_code || ''}</p>
          <p>${invoice.entity.country || ''}</p>
          ` : ''}
        </div>
        
        <div>
          <p><strong>Invoice Date:</strong> ${formatDate(new Date(invoice.issue_date))}</p>
          <p><strong>Due Date:</strong> ${formatDate(new Date(invoice.due_date))}</p>
          <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
          ${invoice.invoice_type ? `<p><strong>Type:</strong> ${invoice.invoice_type}</p>` : ''}
          ${invoice.calculation_reference ? `<p><strong>Calculation Reference:</strong> ${invoice.calculation_reference}</p>` : ''}
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
            <tr>
              <td>
                ${item.description}
                ${item.policy ? `<div style="font-size: 12px; color: #6b7280;">Policy: ${item.policy.policy_number} - ${item.policy.policyholder_name}</div>` : ''}
              </td>
              <td class="text-right">${formatCurrency(item.amount, invoice.currency)}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td>Total</td>
            <td class="text-right">${formatCurrency(invoice.total_amount, invoice.currency)}</td>
          </tr>
        </tbody>
      </table>
      
      ${invoice.notes ? `
        <div class="notes">
          <p><strong>Notes:</strong></p>
          <p>${invoice.notes}</p>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Invoice generated on ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `);
  
  iframeDoc.close();
  
  // Use html2canvas and jsPDF in a real implementation
  // For this example, we'll create a simple blob that can be downloaded
  const htmlContent = iframeDoc.documentElement.outerHTML;
  const blob = new Blob([htmlContent], { type: 'application/pdf' });
  
  // Clean up the iframe
  document.body.removeChild(iframe);
  
  return blob;
};
