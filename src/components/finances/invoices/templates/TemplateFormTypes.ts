
export interface TemplateFormValues {
  name: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  font_size: string;
  font_weight: 'normal' | 'bold' | 'light';
  font_style: 'normal' | 'italic';
  logo_position: 'left' | 'center' | 'right';
  header_text: string;
  footer_text: string;
  show_payment_instructions: boolean;
  payment_instructions: string;
  is_default: boolean;
}
