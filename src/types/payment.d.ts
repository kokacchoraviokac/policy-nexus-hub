
export interface Payment {
  id: string;
  reference: string;
  amount: number;
  payment_date: string;
  currency: string;
  payer_name?: string;
  status: string;
  linked_policy_id?: string;
  linked_at?: string;
  linked_by?: string;
  created_at: string;
  company_id: string;
}

export interface PaymentSummary {
  totalPaid: number;
  totalDue: number;
  paymentPercentage: number;
  isOverpaid: boolean;
  isFullyPaid: boolean;
}
