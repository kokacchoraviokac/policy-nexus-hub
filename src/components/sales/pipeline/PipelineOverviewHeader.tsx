
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RefreshCw, Filter, Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("pipelineOverview")}</h1>
        <p className="text-muted-foreground mt-1">{t("pipelineOverviewDescription")}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Select 
          value={selectedPeriod} 
          onValueChange={onFilterChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t("period")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{t("last7Days")}</span>
              </div>
            </SelectItem>
            <SelectItem value="30days">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>{t("last30Days")}</span>
              </div>
            </SelectItem>
            <SelectItem value="90days">
              <div className="flex items-center">
                <CalendarRange className="h-4 w-4 mr-2" />
                <span>{t("last90Days")}</span>
              </div>
            </SelectItem>
            <SelectItem value="all">
              <div className="flex items-center">
                <CalendarRange className="h-4 w-4 mr-2" />
                <span>{t("allTime")}</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-4 w-4" />
              {t("moreFilters")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>{t("filterBy")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">{t("insuranceType")}</DropdownMenuLabel>
              <DropdownMenuItem>
                {t("life")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t("nonLife")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t("health")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">{t("responsiblePerson")}</DropdownMenuLabel>
              <DropdownMenuItem>
                {t("allPersons")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                John Doe
              </DropdownMenuItem>
              <DropdownMenuItem>
                Jane Smith
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="default" 
          size="sm"
          onClick={onRefresh}
          className="gap-1.5"
        >
          <RefreshCw className="h-4 w-4" />
          {t("refresh")}
        </Button>
      </div>
    </div>
  );
};

export default PipelineOverviewHeader;
