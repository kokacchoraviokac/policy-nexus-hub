
import { QuoteRequest, Quote, QuoteFilter, QuoteStatus } from "@/types/quotes";
import { BaseService, ServiceResponse } from "./BaseService";

export class QuoteService extends BaseService {
  /**
   * Create a new quote
   */
  static async createQuote(quoteData: QuoteRequest): Promise<ServiceResponse<Quote>> {
    try {
      const service = new QuoteService();
      const supabase = service.getClient();
      
      // Create quote with default status of 'draft'
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          sales_process_id: quoteData.salesProcessId,
          insurer_name: quoteData.insurerName,
          amount: quoteData.requestedAmount || "0",
          currency: quoteData.currency || "EUR",
          coverage_details: quoteData.coverageDetails,
          status: 'draft',
          created_at: new Date().toISOString(),
          notes: quoteData.notes || null,
          coverage_start_date: quoteData.coverageStartDate || null,
          coverage_end_date: quoteData.coverageEndDate || null,
        })
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Transform database response to Quote interface
      const quote: Quote = {
        id: data.id,
        salesProcessId: data.sales_process_id,
        insurerName: data.insurer_name,
        amount: data.amount,
        currency: data.currency,
        coverageDetails: data.coverage_details,
        status: data.status as QuoteStatus,
        createdAt: data.created_at,
        sentAt: data.sent_at,
        responseReceivedAt: data.response_received_at,
        expiresAt: data.expires_at,
        selectedAt: data.selected_at,
        rejectedAt: data.rejected_at,
        notes: data.notes,
        coverageStartDate: data.coverage_start_date,
        coverageEndDate: data.coverage_end_date,
        policyNumber: data.policy_number,
        isPolicyImported: data.is_policy_imported,
      };
      
      return service.createResponse<Quote>(true, quote);
    } catch (error) {
      const service = new QuoteService();
      const errorResponse = service.handleError(error);
      return service.createResponse<Quote>(false, undefined, errorResponse);
    }
  }
  
  /**
   * Get quotes for a sales process
   */
  static async getQuotes(salesProcessId: string): Promise<ServiceResponse<Quote[]>> {
    try {
      const service = new QuoteService();
      const supabase = service.getClient();
      
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('sales_process_id', salesProcessId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform database response to Quote interface
      const quotes: Quote[] = data.map(item => ({
        id: item.id,
        salesProcessId: item.sales_process_id,
        insurerName: item.insurer_name,
        amount: item.amount,
        currency: item.currency,
        coverageDetails: item.coverage_details,
        status: item.status as QuoteStatus,
        createdAt: item.created_at,
        sentAt: item.sent_at,
        responseReceivedAt: item.response_received_at,
        expiresAt: item.expires_at,
        selectedAt: item.selected_at,
        rejectedAt: item.rejected_at,
        notes: item.notes,
        coverageStartDate: item.coverage_start_date,
        coverageEndDate: item.coverage_end_date,
        policyNumber: item.policy_number,
        isPolicyImported: item.is_policy_imported,
      }));
      
      return service.createResponse<Quote[]>(true, quotes);
    } catch (error) {
      const service = new QuoteService();
      const errorResponse = service.handleError(error);
      return service.createResponse<Quote[]>(false, undefined, errorResponse);
    }
  }
  
  /**
   * Update quote status
   */
  static async updateQuoteStatus(quoteId: string, status: QuoteStatus): Promise<ServiceResponse<Quote>> {
    try {
      const service = new QuoteService();
      const supabase = service.getClient();
      
      // Prepare update data based on status
      const updateData: Record<string, any> = { status };
      
      // Add timestamp fields depending on the status
      const now = new Date().toISOString();
      switch (status) {
        case 'pending':
          updateData.sent_at = now;
          break;
        case 'received':
          updateData.response_received_at = now;
          break;
        case 'selected':
          updateData.selected_at = now;
          break;
        case 'rejected':
          updateData.rejected_at = now;
          break;
        case 'expired':
          updateData.expires_at = now;
          break;
      }
      
      // Update the quote
      const { data, error } = await supabase
        .from('quotes')
        .update(updateData)
        .eq('id', quoteId)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      // If we're selecting this quote, we need to reset any other selected quotes
      if (status === 'selected') {
        await supabase
          .from('quotes')
          .update({ status: 'received' })
          .eq('sales_process_id', data.sales_process_id)
          .neq('id', quoteId)
          .eq('status', 'selected');
      }
      
      // Transform database response to Quote interface
      const quote: Quote = {
        id: data.id,
        salesProcessId: data.sales_process_id,
        insurerName: data.insurer_name,
        amount: data.amount,
        currency: data.currency,
        coverageDetails: data.coverage_details,
        status: data.status as QuoteStatus,
        createdAt: data.created_at,
        sentAt: data.sent_at,
        responseReceivedAt: data.response_received_at,
        expiresAt: data.expires_at,
        selectedAt: data.selected_at,
        rejectedAt: data.rejected_at,
        notes: data.notes,
        coverageStartDate: data.coverage_start_date,
        coverageEndDate: data.coverage_end_date,
        policyNumber: data.policy_number,
        isPolicyImported: data.is_policy_imported,
      };
      
      return service.createResponse<Quote>(true, quote);
    } catch (error) {
      const service = new QuoteService();
      const errorResponse = service.handleError(error);
      return service.createResponse<Quote>(false, undefined, errorResponse);
    }
  }
}
