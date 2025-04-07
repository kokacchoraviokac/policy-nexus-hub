
export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsCount?: number;
  itemsPerPage?: number;
  className?: string;
}

export interface PaginationItemProps {
  page: number;
  onClick: () => void;
  isActive?: boolean;
  children?: React.ReactNode;
}

export interface DocumentsTabProps {
  entityId?: string;
  entityType?: string;
}

export interface PolicyImportReviewProps {
  policies: any[];
  invalidPolicies: any[];
  validationErrors: any;
  isSubmitting?: boolean;
  onSubmit?: () => Promise<void>;
}

export interface FilterBarProps {
  searchValue: string;
  onSearchChange: React.Dispatch<React.SetStateAction<string>>;
  searchPlaceholder: string;
  resetFilters?: () => void;
  children?: React.ReactNode;
}

export interface PaginationControllerProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  itemsCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}
