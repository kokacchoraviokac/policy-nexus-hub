
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterBarProps {
  searchValue: string;
  onSearchChange: React.Dispatch<React.SetStateAction<string>>;
  searchPlaceholder: string;
  resetFilters?: () => void;
  children?: React.ReactNode;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  resetFilters,
  children
}) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <div className="relative flex-1">
        <Input
          className="w-full"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <Filter className="h-4 w-4 mr-2" />
            {t("filters")}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-auto">
          <SheetHeader>
            <SheetTitle>{t("advancedFilters")}</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {children}
          </div>
          {resetFilters && (
            <div className="pt-4 border-t flex justify-end">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                {t("resetFilters")}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FilterBar;
