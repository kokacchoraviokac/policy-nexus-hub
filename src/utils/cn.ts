
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function that combines clsx and tailwind-merge for convenient className handling
 * It allows conditional classes, handling objects and arrays, while properly merging Tailwind classes
 * 
 * @param inputs - Class values to be merged
 * @returns Merged className string
 * 
 * @example
 * // Basic usage
 * cn("px-4 py-2", "bg-blue-500")
 * // => "px-4 py-2 bg-blue-500"
 * 
 * // With conditionals
 * cn("px-4", isActive && "bg-blue-500", !isActive && "bg-gray-200")
 * 
 * // With objects
 * cn("px-4", { "bg-blue-500": isActive, "bg-gray-200": !isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
