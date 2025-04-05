
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  details?: any;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface FilterParams {
  [key: string]: any;
}

export interface SortParams {
  column: string;
  direction: 'asc' | 'desc';
}

export interface QueryParams extends PaginationParams {
  filters?: FilterParams;
  sort?: SortParams;
  search?: string;
}

export interface PolicyFilterParams {
  status?: string;
  workflow_status?: string;
  client_id?: string;
  insurer_id?: string;
  date_from?: string;
  date_to?: string;
  expiry_from?: string;
  expiry_to?: string;
  search?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  status: string;
}

export interface ServiceResponseWithPagination<T> extends ServiceResponse<T> {
  pagination?: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    pageSize: number;
  };
}
