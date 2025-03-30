
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { validStatusTransitions, isValidStatusTransition } from "../utils/statusTransitions";

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
  
  // Get valid next statuses for the current status
  const validNextStatuses = validStatusTransitions[currentStatus] || [];
  
  // Check if the transition is valid
  const isValidTransition = isValidStatusTransition(currentStatus, newStatus);
  const showWarning = newStatus !== currentStatus && !isValidTransition;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("currentStatus")}</label>
        <div className="p-2 bg-muted rounded-md">
          {t(currentStatus.toLowerCase().replace(/ /g, ""))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("newStatus")}</label>
        <Select value={newStatus} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder={t("selectNewStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in processing">{t("inProcessing")}</SelectItem>
            <SelectItem value="reported">{t("reported")}</SelectItem>
            <SelectItem value="accepted">{t("accepted")}</SelectItem>
            <SelectItem value="rejected">{t("rejected")}</SelectItem>
            <SelectItem value="partially accepted">{t("partiallyAccepted")}</SelectItem>
            <SelectItem value="appealed">{t("appealed")}</SelectItem>
            <SelectItem value="paid">{t("paid")}</SelectItem>
            <SelectItem value="withdrawn">{t("withdrawn")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {validNextStatuses.length > 0 && (
        <div className="px-3 py-2 bg-blue-50 text-blue-800 rounded-md flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">{t("recommendedStatusTransitions")}:</p>
            <ul className="list-disc list-inside mt-1">
              {validNextStatuses.map(status => (
                <li key={status}>{t(status.toLowerCase().replace(/ /g, ""))}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {showWarning && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("unusualStatusTransitionWarning")}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StatusSelector;
