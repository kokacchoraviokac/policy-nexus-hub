
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";

const ResponsiblePersons = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("responsiblePersons")}</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("assignResponsibility")}
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          placeholder={t("searchAssignments")}
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:w-72"
        />
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <EmptyState
          title={t("noAssignmentsFound")}
          description={t("createYourFirstAssignment")}
          icon={<Users className="h-6 w-6 text-muted-foreground" />}
          action={
            <Button className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("assignResponsibility")}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default ResponsiblePersons;
