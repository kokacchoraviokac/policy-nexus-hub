
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
import ClaimStatusBadge from "../ClaimStatusBadge";
import { getAllowedStatusTransitions } from "../utils/statusTransitions";

interface StatusSelectorProps {
  currentStatus: string;
  newStatus: string;
  onStatusChange: (status: string) => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  newStatus,
  onStatusChange
}) => {
  const { t } = useLanguage();
  
  // Get allowed transitions for the current status
  const allowedTransitions = getAllowedStatusTransitions(currentStatus);
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>{t("currentStatus")}</Label>
        <ClaimStatusBadge status={currentStatus} />
      </div>
      
      <div className="space-y-2">
        <Label>{t("newStatus")}</Label>
        <Select
          value={newStatus}
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("selectStatus")} />
          </SelectTrigger>
          <SelectContent>
            {allowedTransitions.map((status) => (
              <SelectItem key={status} value={status}>
                {t(status.toLowerCase().replace(/ /g, ""))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StatusSelector;
