
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Leads = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("leads")}</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("newLead")}
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          placeholder={t("searchLeads")}
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:w-72"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allLeads")}</SelectItem>
            <SelectItem value="new">{t("newLeads")}</SelectItem>
            <SelectItem value="qualified">{t("qualifiedLeads")}</SelectItem>
            <SelectItem value="converted">{t("convertedLeads")}</SelectItem>
            <SelectItem value="lost">{t("lostLeads")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <EmptyState
          title={t("noLeadsFound")}
          description={t("createYourFirstLead")}
          icon={<UserPlus className="h-6 w-6 text-muted-foreground" />}
          action={
            <Button className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("newLead")}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default Leads;
