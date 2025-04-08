
import { format, parseISO } from "date-fns";

export const formatDate = (dateString: string) => {
  try {
    if (!dateString) return "";
    // Try to parse the date string
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, "PPP");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const formatDateTime = (dateString: string) => {
  try {
    if (!dateString) return "";
    // Try to parse the date string
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, "PPP p");
  } catch (error) {
    console.error("Error formatting date time:", error);
    return dateString;
  }
};

export const formatCurrency = (amount?: number, currency: string = "EUR") => {
  if (amount === undefined || amount === null) return "";
  
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${amount} ${currency}`;
  }
};

export const formatPercent = (value?: number) => {
  if (value === undefined || value === null) return "";
  
  try {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
    }).format(value / 100);
  } catch (error) {
    console.error("Error formatting percent:", error);
    return `${value}%`;
  }
};
