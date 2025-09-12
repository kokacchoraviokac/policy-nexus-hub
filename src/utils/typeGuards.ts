/**
 * Comprehensive Type Guards and Validation Utilities
 * 
 * This module provides type-safe validation functions to replace explicit 'any' types
 * throughout the PolicyHub application with proper type checking.
 */

// ============================================================================
// BASIC TYPE GUARDS
// ============================================================================

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

export const isNullish = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

// ============================================================================
// ADVANCED TYPE GUARDS
// ============================================================================

export const isStringArray = (value: unknown): value is string[] => {
  return isArray(value) && value.every(isString);
};

export const isNumberArray = (value: unknown): value is number[] => {
  return isArray(value) && value.every(isNumber);
};

export const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

export const isValidDateString = (value: unknown): value is string => {
  if (!isString(value)) return false;
  const date = new Date(value);
  return isValidDate(date);
};

export const isValidEmail = (value: unknown): value is string => {
  if (!isString(value)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const isValidUUID = (value: unknown): value is string => {
  if (!isString(value)) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

// ============================================================================
// BUSINESS DOMAIN TYPE GUARDS
// ============================================================================

export const isValidPolicyStatus = (value: unknown): value is 'active' | 'inactive' | 'expired' | 'cancelled' => {
  return isString(value) && ['active', 'inactive', 'expired', 'cancelled'].includes(value);
};

export const isValidWorkflowStatus = (value: unknown): value is 'draft' | 'in_review' | 'ready' | 'complete' => {
  return isString(value) && ['draft', 'in_review', 'ready', 'complete'].includes(value);
};

export const isValidClaimStatus = (value: unknown): value is 'in_processing' | 'reported' | 'accepted' | 'rejected' | 'partially_accepted' | 'appealed' | 'withdrawn' => {
  const validStatuses = ['in_processing', 'reported', 'accepted', 'rejected', 'partially_accepted', 'appealed', 'withdrawn'];
  return isString(value) && validStatuses.includes(value);
};

export const isValidCurrency = (value: unknown): value is 'EUR' | 'USD' | 'RSD' => {
  return isString(value) && ['EUR', 'USD', 'RSD'].includes(value);
};

export const isValidUserRole = (value: unknown): value is 'super_admin' | 'admin' | 'employee' => {
  return isString(value) && ['super_admin', 'admin', 'employee'].includes(value);
};

// ============================================================================
// OBJECT STRUCTURE VALIDATORS
// ============================================================================

export interface PolicyData {
  id: string;
  policy_number: string;
  policyholder_name: string;
  insurer_name: string;
  premium: number;
  currency: string;
  start_date: string;
  expiry_date: string;
  status: string;
  workflow_status: string;
}

export const isPolicyData = (value: unknown): value is PolicyData => {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isString(obj['id']) &&
    isString(obj['policy_number']) &&
    isString(obj['policyholder_name']) &&
    isString(obj['insurer_name']) &&
    isNumber(obj['premium']) &&
    isValidCurrency(obj['currency']) &&
    isValidDateString(obj['start_date']) &&
    isValidDateString(obj['expiry_date']) &&
    isValidPolicyStatus(obj['status']) &&
    isValidWorkflowStatus(obj['workflow_status'])
  );
};

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  company_id?: string;
}

export const isUserData = (value: unknown): value is UserData => {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isString(obj['id']) &&
    isValidEmail(obj['email']) &&
    isString(obj['name']) &&
    isValidUserRole(obj['role']) &&
    (isUndefined(obj['company_id']) || isString(obj['company_id']))
  );
};

export interface DocumentData {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  uploaded_by: string;
  created_at: string;
  category?: string;
  version?: number;
}

export const isDocumentData = (value: unknown): value is DocumentData => {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isString(obj['id']) &&
    isString(obj['document_name']) &&
    isString(obj['document_type']) &&
    isString(obj['file_path']) &&
    isString(obj['uploaded_by']) &&
    isValidDateString(obj['created_at']) &&
    (isUndefined(obj['category']) || isString(obj['category'])) &&
    (isUndefined(obj['version']) || isNumber(obj['version']))
  );
};

// ============================================================================
// API RESPONSE VALIDATORS
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export const isApiResponse = <T>(
  value: unknown,
  dataValidator: (data: unknown) => data is T
): value is ApiResponse<T> => {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isBoolean(obj['success']) &&
    (isNull(obj['error']) || isString(obj['error'])) &&
    (isNull(obj['data']) || dataValidator(obj['data']))
  );
};

export const isSupabaseResponse = (value: unknown): value is { data: unknown; error: unknown } => {
  if (!isObject(value)) return false;
  
  const obj = value as Record<string, unknown>;
  
  return 'data' in obj && 'error' in obj;
};

// ============================================================================
// FORM DATA VALIDATORS
// ============================================================================

export const isFormData = (value: unknown): value is FormData => {
  return value instanceof FormData;
};

export const isFileList = (value: unknown): value is FileList => {
  return value instanceof FileList;
};

export const isFile = (value: unknown): value is File => {
  return value instanceof File;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely parse JSON with type validation
 */
export const safeJsonParse = <T>(
  jsonString: string,
  validator: (value: unknown) => value is T
): T | null => {
  try {
    const parsed = JSON.parse(jsonString);
    return validator(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Assert that a value matches a type guard, throwing an error if not
 */
export const assertType = <T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  errorMessage: string
): asserts value is T => {
  if (!guard(value)) {
    throw new Error(errorMessage);
  }
};

/**
 * Safely access nested object properties
 */
export const safeGet = <T>(
  obj: unknown,
  path: string[],
  validator: (value: unknown) => value is T
): T | undefined => {
  let current = obj;
  
  for (const key of path) {
    if (!isObject(current) || !(key in current)) {
      return undefined;
    }
    current = current[key];
  }
  
  return validator(current) ? current : undefined;
};

/**
 * Create a type-safe array filter
 */
export const createTypedFilter = <T>(
  validator: (value: unknown) => value is T
) => {
  return (array: unknown[]): T[] => {
    return array.filter(validator);
  };
};

/**
 * Validate and transform unknown data to typed data
 */
export const validateAndTransform = <T, U>(
  data: unknown,
  validator: (value: unknown) => value is T,
  transformer: (value: T) => U
): U | null => {
  if (!validator(data)) {
    return null;
  }
  
  try {
    return transformer(data);
  } catch {
    return null;
  }
};