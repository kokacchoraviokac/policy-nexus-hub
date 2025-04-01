
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import StatusSelector from "@/components/common/StatusSelector";

interface AuthorizationFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void;
}

const AuthorizationFilters: React.FC<AuthorizationFiltersProps> = ({
  onFilterChange
}) => {
  const { t } = useLanguage();
  const [status, setStatus] = React.useState<string>("all");
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({});
  
  const handleStatusChange = (value: string) => {
    setStatus(value);
    
    if (value === "all") {
      const newFilters = { ...activeFilters };
      delete newFilters.status;
      setActiveFilters(newFilters);
    } else {
      setActiveFilters({
        ...activeFilters,
        status: value
      });
    }
  };
  
  const clearFilters = () => {
    setStatus("all");
    setActiveFilters({});
  };
  
  return (
    <div className="space-y-4 pb-2 border-b">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">
            {t("status")}
          </label>
          <StatusSelector
            value={status}
            onValueChange={handleStatusChange}
            showAllOption={true}
            allOptionText={t("allStatuses")}
            statusOptions={["pending", "approved", "rejected", "expired"]}
            className="w-full"
          />
        </div>
      </div>
      
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            {t("activeFilters")}:
          </span>
          
          {Object.entries(activeFilters).map(([key, value]) => (
            <Badge key={key} variant="secondary" className="flex items-center">
              {t(key)}: {t(value)}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0"
                onClick={() => {
                  const newFilters = { ...activeFilters };
                  delete newFilters[key];
                  setActiveFilters(newFilters);
                  if (key === "status") setStatus("all");
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">{t("removeFilter")}</span>
              </Button>
            </Badge>
          ))}
          
          {Object.keys(activeFilters).length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={clearFilters}
            >
              {t("clearFilters")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthorizationFilters;
