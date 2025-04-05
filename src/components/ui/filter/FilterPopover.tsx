
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterPopoverProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  children,
  trigger,
  className
}) => {
  const { t } = useLanguage();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {t("filter")}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className={`w-80 p-0 ${className}`} align="end">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
