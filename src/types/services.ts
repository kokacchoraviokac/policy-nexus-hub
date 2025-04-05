
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: Error | string | Record<string, any>;
}
