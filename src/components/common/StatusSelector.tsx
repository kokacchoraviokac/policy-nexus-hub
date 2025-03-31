
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  showAllOption?: boolean;
  allOptionText?: string;
  statusOptions: string[];
  className?: string;
  placeholder?: string;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  value,
  onValueChange,
  showAllOption = false,
  allOptionText = "All Statuses",
  statusOptions,
  className,
  placeholder = "Select status",
}) => {
  const { t } = useLanguage();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && <SelectItem value="all">{allOptionText}</SelectItem>}
        {statusOptions.map((status) => (
          <SelectItem key={status} value={status}>
            {t(status) || status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusSelector;
