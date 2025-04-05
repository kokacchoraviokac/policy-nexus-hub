
import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter } from "./FilterBar";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterPopoverProps {
  title: string;
  filters: Filter[];
  selectedValues?: string[];
  onFilterChange?: (values: string[]) => void;
  multiSelect?: boolean;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  title,
  filters,
  selectedValues = [],
  onFilterChange,
  multiSelect = true,
}) => {
  const { t } = useLanguage();
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (!onFilterChange) return;

    if (multiSelect) {
      // If value is already selected, remove it, otherwise add it
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
        
      onFilterChange(newValues);
    } else {
      // For single select, just set the value or clear if it's already selected
      onFilterChange(selectedValues.includes(value) ? [] : [value]);
    }
  };

  const selectedCount = selectedValues.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-dashed">
          {title}
          {selectedCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 rounded-sm px-1 font-normal"
            >
              {selectedCount}
            </Badge>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t("search")} />
          <CommandList>
            <CommandEmpty>{t("noResultsFound")}</CommandEmpty>
            <CommandGroup>
              {filters.map((filter) => (
                <CommandItem
                  key={filter.value}
                  onSelect={() => handleSelect(filter.value)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {filter.label}
                    {filter.count !== undefined && (
                      <Badge variant="outline" className="ml-2">
                        {filter.count}
                      </Badge>
                    )}
                  </div>
                  {selectedValues.includes(filter.value) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedCount > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onFilterChange && onFilterChange([])}
                    className="justify-center text-center"
                  >
                    {t("clearFilters")}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
