
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import FilterPopover from "./FilterPopover";

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  className?: string;
  showSearch?: boolean;
  showFilter?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchValue = "",
  onSearchChange,
  searchPlaceholder,
  children,
  className = "",
  showSearch = true,
  showFilter = true
}) => {
  const { t } = useLanguage();

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {showSearch && (
        <div className="flex-1 min-w-[200px]">
          <InputWithIcon
            leftIcon={<Search className="h-4 w-4" />}
            type="text"
            placeholder={searchPlaceholder || t("search")}
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}
      
      {showFilter && (
        <FilterPopover>{children}</FilterPopover>
      )}
    </div>
  );
};

export default FilterBar;
