
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";

interface StatusSelectorProps {
  currentStatus: string;
  newStatus: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  newStatus,
  onStatusChange,
  disabled = false,
}) => {
  const { t } = useLanguage();

  // Define possible statuses and valid transitions
  const getAvailableStatuses = (current: string): string[] => {
    const allStatuses = [
      "in processing",
      "reported",
      "accepted",
      "rejected",
      "appealed",
      "partially accepted",
      "withdrawn"
    ];
    
    // You can define constraints on valid transitions here
    switch (current.toLowerCase()) {
      case "in processing":
        return ["in processing", "reported", "withdrawn"];
      case "reported":
        return ["reported", "in processing", "accepted", "rejected", "partially accepted", "withdrawn"];
      case "accepted":
        return ["accepted", "appealed", "withdrawn"];
      case "rejected":
        return ["rejected", "appealed", "withdrawn"];
      case "appealed":
        return ["appealed", "accepted", "rejected", "partially accepted", "withdrawn"];
      case "partially accepted":
        return ["partially accepted", "appealed", "withdrawn"];
      case "withdrawn":
        return ["withdrawn"]; // Terminal state
      default:
        return allStatuses;
    }
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{t("currentStatus")}</Label>
        <ClaimStatusBadge status={currentStatus} />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="status-select">{t("newStatus")}</Label>
        <Select 
          value={newStatus} 
          onValueChange={onStatusChange}
          disabled={disabled}
        >
          <SelectTrigger id="status-select" className="w-full">
            <SelectValue placeholder={t("selectStatus")} />
          </SelectTrigger>
          <SelectContent>
            {availableStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                <div className="flex items-center gap-2">
                  <ClaimStatusBadge status={status} />
                  <span>{t(status.replace(/ /g, ""))}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StatusSelector;
