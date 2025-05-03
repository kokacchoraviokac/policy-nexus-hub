
import { format } from "date-fns";

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "PPP");
  } catch (error) {
    return dateString;
  }
};

export const formatCurrency = (value: number, currency = "EUR") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat().format(value);
};

export const formatPercentage = (value: number) => {
  return `${value}%`;
};
