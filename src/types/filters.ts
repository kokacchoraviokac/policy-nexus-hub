
export interface FilterOption {
  id: string;
  label: string;
  value?: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}
