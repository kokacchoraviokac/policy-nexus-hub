
/**
 * Utility functions for common validation patterns
 */

export function isValidEmail(email: string): boolean {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  // Basic phone validation - allows various formats
  // This is a simplified version, you may want to use a library for more complex validation
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phone === "" || phoneRegex.test(phone);
}

export function isValidTaxId(taxId: string): boolean {
  // This is a simple validation that ensures the tax ID is numeric
  // Customize based on your country's tax ID format
  return taxId === "" || /^[0-9]{8,15}$/.test(taxId);
}

export function isValidPostalCode(postalCode: string): boolean {
  // This is a simple validation that ensures the postal code has the right format
  // Customize based on your country's postal code format
  return postalCode === "" || /^[0-9A-Z]{3,10}$/.test(postalCode);
}

export function isValidPolicyNumber(policyNumber: string): boolean {
  // Policy numbers generally have specific formats
  // This is a placeholder - customize for your specific policy number format
  return /^[A-Z0-9]{5,20}$/.test(policyNumber);
}

export function isValidPercentage(value: number): boolean {
  return value >= 0 && value <= 100;
}

export function isValidCurrency(value: number): boolean {
  return value >= 0;
}

export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export function isValidFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isValidDate(date) && date >= today;
}

export function isValidPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isValidDate(date) && date < today;
}

export function isNotEmpty(value: string): boolean {
  return value.trim() !== "";
}

export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}
