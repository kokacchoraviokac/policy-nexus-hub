
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/contexts/LanguageContext";

export interface DatePickerProps {
  date: Date | undefined;
  setDate?: (date: Date | undefined) => void;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  id?: string;
}

export function DatePicker({ date, setDate, onSelect, className, placeholder, id }: DatePickerProps) {
  const { t } = useLanguage();
  
  const handleSelect = (date: Date | undefined) => {
    if (setDate) setDate(date);
    if (onSelect) onSelect(date);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder || t("selectDate")}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
