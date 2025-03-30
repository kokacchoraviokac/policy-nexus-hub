
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, ClipboardList } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SalesProcesses = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("salesProcesses")}</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("newSalesProcess")}
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          placeholder={t("searchSalesProcesses")}
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:w-72"
        />
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t("stage")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStages")}</SelectItem>
            <SelectItem value="quote">{t("quoteManagement")}</SelectItem>
            <SelectItem value="authorization">{t("clientAuthorization")}</SelectItem>
            <SelectItem value="proposal">{t("policyProposal")}</SelectItem>
            <SelectItem value="signed">{t("signedPolicies")}</SelectItem>
            <SelectItem value="concluded">{t("concluded")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <EmptyState
          title={t("noSalesProcessesFound")}
          description={t("createYourFirstSalesProcess")}
          icon={<ClipboardList className="h-6 w-6 text-muted-foreground" />}
          action={
            <Button className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("newSalesProcess")}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default SalesProcesses;
