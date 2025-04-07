import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined, formatString: string = "PPP"): string {
  if (!date) return "N/A";
  
  try {
    let dateObject: Date;
    if (typeof date === "string") {
      // Try to parse the ISO string
      dateObject = parseISO(date);
    } else {
      dateObject = date;
    }
    
    if (!isValid(dateObject)) {
      return "Invalid Date";
    }
    
    return format(dateObject, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, "PPP p");
}

export function formatCurrency(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
