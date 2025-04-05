
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

export interface PolicyFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  insurerId?: string;
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}
