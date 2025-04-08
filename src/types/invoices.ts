
import { TemplateFormValues } from '@/components/finances/invoices/templates/TemplateFormTypes';

export interface CreateTemplateData extends TemplateFormValues {
  company_id: string;
  background_color: string;
  address_format: string;
  amount_format: string;
}

export interface InvoiceTemplateSettings extends TemplateFormValues {
  id?: string;
  company_id?: string;
  background_color?: string;
  address_format?: string;
  amount_format?: string;
  created_at?: string;
  updated_at?: string;
}
