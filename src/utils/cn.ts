
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function for conditionally joining class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
