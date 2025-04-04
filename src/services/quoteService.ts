
import { Quote, QuoteRequest, QuoteFilter } from "@/types/quotes";
import { mockQuotes } from "@/data/mockQuotes";

// In a real implementation, this would make API calls to your backend

/**
 * Fetch quotes with optional filtering
 */
export const fetchQuotes = async (filters?: QuoteFilter): Promise<Quote[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredQuotes = [...mockQuotes];
  
  if (filters) {
    if (filters.status && filters.status !== 'all') {
      filteredQuotes = filteredQuotes.filter(quote => quote.status === filters.status);
    }
    
    if (filters.insurerName) {
      filteredQuotes = filteredQuotes.filter(quote => 
        quote.insurerName.toLowerCase().includes(filters.insurerName!.toLowerCase())
      );
    }
    
    if (filters.salesProcessId) {
      filteredQuotes = filteredQuotes.filter(quote => 
        quote.salesProcessId === filters.salesProcessId
      );
    }
    
    if (filters.dateRange) {
      filteredQuotes = filteredQuotes.filter(quote => {
        const createdDate = new Date(quote.createdAt).getTime();
        const startDate = new Date(filters.dateRange!.start).getTime();
        const endDate = new Date(filters.dateRange!.end).getTime();
        
        return createdDate >= startDate && createdDate <= endDate;
      });
    }
  }
  
  return filteredQuotes;
};

/**
 * Create a new quote request
 */
export const createQuote = async (quoteRequest: QuoteRequest): Promise<Quote> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newQuote: Quote = {
    id: `quote-${Date.now()}`,
    salesProcessId: quoteRequest.salesProcessId,
    insurerName: quoteRequest.insurerName,
    amount: quoteRequest.requestedAmount || "0",
    currency: quoteRequest.currency || "EUR",
    coverageDetails: quoteRequest.coverageDetails,
    status: 'draft',
    createdAt: new Date().toISOString(),
    notes: quoteRequest.notes,
    coverageStartDate: quoteRequest.coverageStartDate,
    coverageEndDate: quoteRequest.coverageEndDate,
  };
  
  return newQuote;
};

/**
 * Send a quote to the insurer
 */
export const sendQuote = async (quoteId: string): Promise<Quote> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, this would update the database
  const updatedQuote = mockQuotes.find(q => q.id === quoteId);
  
  if (!updatedQuote) {
    throw new Error("Quote not found");
  }
  
  return {
    ...updatedQuote,
    status: 'pending',
    sentAt: new Date().toISOString(),
  };
};

/**
 * Update quote status
 */
export const updateQuoteStatus = async (
  quoteId: string, 
  status: QuoteStatus,
  notes?: string
): Promise<Quote> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, this would update the database
  const quote = mockQuotes.find(q => q.id === quoteId);
  
  if (!quote) {
    throw new Error("Quote not found");
  }
  
  const updatedQuote = {
    ...quote,
    status,
    notes: notes || quote.notes,
    ...(status === 'received' ? { responseReceivedAt: new Date().toISOString() } : {}),
    ...(status === 'selected' ? { selectedAt: new Date().toISOString() } : {}),
    ...(status === 'rejected' ? { rejectedAt: new Date().toISOString() } : {}),
    ...(status === 'expired' ? { expiresAt: new Date().toISOString() } : {})
  };
  
  return updatedQuote;
};

/**
 * Get a single quote by ID
 */
export const getQuoteById = async (quoteId: string): Promise<Quote | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const quote = mockQuotes.find(q => q.id === quoteId);
  return quote || null;
};

/**
 * Delete a quote
 */
export const deleteQuote = async (quoteId: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would delete from the database
  const index = mockQuotes.findIndex(q => q.id === quoteId);
  
  if (index !== -1) {
    mockQuotes.splice(index, 1);
  }
};

/**
 * Mark a quote as ready for policy import
 */
export const markQuoteForPolicyImport = async (quoteId: string): Promise<Quote> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real implementation, this would update the database
  const quote = mockQuotes.find(q => q.id === quoteId);
  
  if (!quote) {
    throw new Error("Quote not found");
  }
  
  if (quote.status !== 'selected') {
    throw new Error("Only selected quotes can be marked for policy import");
  }
  
  return {
    ...quote,
    isPolicyImported: true
  };
};

/**
 * Get quotes by sales process ID
 */
export const getQuotesBySalesProcessId = async (salesProcessId: string): Promise<Quote[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockQuotes.filter(q => q.salesProcessId === salesProcessId);
};
