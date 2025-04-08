
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Filter, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PipelineOverviewHeaderProps {
  onRefresh: () => void;
  onFilterChange: (period: string) => void;
  selectedPeriod: string;
}

const PipelineOverviewHeader: React.FC<PipelineOverviewHeaderProps> = ({
  onRefresh,
  onFilterChange,
  selectedPeriod,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("pipelineOverview")}</h1>
        <p className="text-muted-foreground mt-1">{t("pipelineDescription")}</p>
      </div>
      <div className="flex items-center gap-2">
        <Select
          defaultValue={selectedPeriod}
          onValueChange={onFilterChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("selectTimePeriod")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">{t("last7Days")}</SelectItem>
            <SelectItem value="30days">{t("last30Days")}</SelectItem>
            <SelectItem value="90days">{t("last90Days")}</SelectItem>
            <SelectItem value="all">{t("allTime")}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PipelineOverviewHeader;
