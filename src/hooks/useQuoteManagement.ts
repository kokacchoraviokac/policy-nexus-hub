
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { QuoteService } from '@/services/quoteService';
import { Quote, QuoteRequest, QuoteFilter, QuoteStatus } from '@/types/quotes';
import { useLanguage } from '@/contexts/LanguageContext';

export const useQuoteManagement = (salesProcessId?: string) => {
  const { t } = useLanguage();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  
  // Fetch all quotes with optional filtering
  const loadQuotes = useCallback(async (filters?: QuoteFilter) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If salesProcessId is provided, always include it in the filter
      const finalFilters = salesProcessId 
        ? { ...filters, salesProcessId } 
        : filters;
        
      const data = await QuoteService.fetchQuotes(finalFilters);
      setQuotes(data);
    } catch (err) {
      setError(err as Error);
      toast.error(t("errorLoadingQuotes"), {
        description: (err as Error).message
      });
    } finally {
      setIsLoading(false);
    }
  }, [salesProcessId, t]);
  
  // Create a new quote
  const addQuote = useCallback(async (quoteData: QuoteRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Ensure the salesProcessId is set
      const finalData = salesProcessId 
        ? { ...quoteData, salesProcessId } 
        : quoteData;
        
      const newQuote = await QuoteService.createQuote(finalData);
      
      // Update local state
      setQuotes(prevQuotes => [...prevQuotes, newQuote]);
      
      toast.success(t("quoteAdded"), {
        description: t("quoteAddedDescription", { insurer: newQuote.insurerName })
      });
      
      return newQuote;
    } catch (err) {
      setError(err as Error);
      toast.error(t("errorAddingQuote"), {
        description: (err as Error).message
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [salesProcessId, t]);
  
  // Send a quote to the insurer
  const submitQuote = useCallback(async (quoteId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedQuote = await QuoteService.sendQuote(quoteId);
      
      // Update local state
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.id === quoteId ? updatedQuote : quote
        )
      );
      
      toast.success(t("quoteSent"), {
        description: t("quoteSentDescription", { insurer: updatedQuote.insurerName })
      });
      
      return updatedQuote;
    } catch (err) {
      setError(err as Error);
      toast.error(t("errorSendingQuote"), {
        description: (err as Error).message
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [t]);
  
  // Update quote status
  const changeQuoteStatus = useCallback(async (quoteId: string, status: QuoteStatus, notes?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedQuote = await QuoteService.updateQuoteStatus(quoteId, status, notes);
      
      // Update local state
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.id === quoteId ? updatedQuote : quote
        )
      );
      
      // If status is "selected", update all other quotes for the same sales process
      if (status === 'selected' && updatedQuote.salesProcessId) {
        setQuotes(prevQuotes => 
          prevQuotes.map(quote => 
            quote.salesProcessId === updatedQuote.salesProcessId && quote.id !== quoteId && quote.status === 'selected'
              ? { ...quote, status: 'received' }
              : quote
          )
        );
        
        // Set this as selected quote
        setSelectedQuote(updatedQuote);
      }
      
      toast.success(t(`quoteMarkedAs${status.charAt(0).toUpperCase() + status.slice(1)}`), {
        description: t(`quote${status.charAt(0).toUpperCase() + status.slice(1)}Description`)
      });
      
      return updatedQuote;
    } catch (err) {
      setError(err as Error);
      toast.error(t("errorUpdatingQuote"), {
        description: (err as Error).message
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [t]);
  
  // Mark a quote as ready for policy import
  const prepareForPolicyImport = useCallback(async (quoteId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedQuote = await QuoteService.markQuoteForPolicyImport(quoteId);
      
      // Update local state
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.id === quoteId ? updatedQuote : quote
        )
      );
      
      toast.success(t("quoteReadyForImport"), {
        description: t("quoteReadyForImportDescription")
      });
      
      return updatedQuote;
    } catch (err) {
      setError(err as Error);
      toast.error(t("errorPreparingQuote"), {
        description: (err as Error).message
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [t]);
  
  // Get the currently selected quote for this sales process
  const findSelectedQuote = useCallback(async () => {
    if (selectedQuote) return selectedQuote;
    
    if (!salesProcessId) return null;
    
    try {
      const allQuotes = await QuoteService.fetchQuotes({ salesProcessId });
      const selected = allQuotes.find(quote => quote.status === 'selected');
      
      if (selected) {
        setSelectedQuote(selected);
        return selected;
      }
      return null;
    } catch (err) {
      console.error("Error finding selected quote:", err);
      return null;
    }
  }, [salesProcessId, selectedQuote]);
  
  // Get policy import eligibility
  const checkPolicyImportEligibility = useCallback(async () => {
    const selected = await findSelectedQuote();
    return !!selected && selected.status === 'selected';
  }, [findSelectedQuote]);
  
  // Delete a quote
  const deleteQuote = useCallback(async (quoteId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await QuoteService.deleteQuote(quoteId);
      
      // Update local state
      setQuotes(prevQuotes => prevQuotes.filter(quote => quote.id !== quoteId));
      
      if (selectedQuote?.id === quoteId) {
        setSelectedQuote(null);
      }
      
      toast.success(t("quoteDeleted"), {
        description: t("quoteDeletedDescription")
      });
      
      return true;
    } catch (err) {
      setError(err as Error);
      toast.error(t("errorDeletingQuote"), {
        description: (err as Error).message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedQuote, t]);
  
  // Get a quote by ID
  const getQuoteById = useCallback(async (quoteId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const quote = await QuoteService.getQuoteById(quoteId);
      return quote;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    quotes,
    isLoading,
    error,
    selectedQuote,
    loadQuotes,
    addQuote,
    submitQuote,
    changeQuoteStatus,
    prepareForPolicyImport,
    findSelectedQuote,
    checkPolicyImportEligibility,
    setSelectedQuote,
    deleteQuote,
    getQuoteById
  };
};
