
// First, fix the Show Payment Instructions part at line 302
if (template?.payment_instructions && template?.show_payment_instructions) {
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

// Fix font_weight and font_style handling at lines 58-59
const fontWeight = template?.font_weight || 'normal';
const fontStyle = template?.font_style || 'normal';

// Fix the policy reference in tableRows at lines 235-236
const tableRows = invoice.items.map(item => {
  let description = item.description;
  
  if (item.policy) {
    description = `${item.description}\nPolicy: ${item.policy.policy_number} - ${item.policy.policyholder_name}`;
  }
  
  return [description, formatCurrency(item.amount, invoice.currency)];
});
