
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterButtonProps {
  activeFilterCount: number;
  onClick: () => void;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  activeFilterCount,
  onClick,
  className
}) => {
  const { t } = useLanguage();

  return (
    <Button
      variant="outline"
      className={`flex items-center gap-1 ${className}`}
      onClick={onClick}
    >
      <Filter className="h-4 w-4" />
      {t("filters")}
      {activeFilterCount > 0 && (
        <Badge variant="secondary" className="ml-1">
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  );
};

export default FilterButton;
