
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface AgentFiltersProps {
  filters: {
    searchTerm?: string;
    status?: 'active' | 'inactive' | 'all';
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    searchTerm?: string;
    status?: 'active' | 'inactive' | 'all';
  }>>;
}

const AgentFilters: React.FC<AgentFiltersProps> = ({ filters, setFilters }) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchAgents")}
              className="pl-9"
              value={filters.searchTerm || ''}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />
          </div>
          
          <Select
            value={filters.status}
            onValueChange={(value: 'active' | 'inactive' | 'all') => 
              setFilters({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="inactive">{t("inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentFilters;
