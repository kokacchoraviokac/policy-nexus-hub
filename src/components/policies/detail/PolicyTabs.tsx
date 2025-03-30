
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CreditCard, CalendarRange, CircleDollarSign, ClipboardList } from "lucide-react";
import PolicyDetailsTab from "./PolicyDetailsTab";
import PolicyDocumentsTab from "./PolicyDocumentsTab";
import PolicyClaimsTab from "./PolicyClaimsTab";
import PolicyFinancialsTab from "./PolicyFinancialsTab";
import PolicyPaymentsTab from "./PolicyPaymentsTab";
import { Policy } from "@/types/policies";

interface PolicyTabsProps {
  policy: Policy;
}

const PolicyTabs: React.FC<PolicyTabsProps> = ({ policy }) => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="details" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline-block">{t("details")}</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          <span className="hidden sm:inline-block">{t("documents")}</span>
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline-block">{t("payments")}</span>
        </TabsTrigger>
        <TabsTrigger value="financials" className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4" />
          <span className="hidden sm:inline-block">{t("financials")}</span>
        </TabsTrigger>
        <TabsTrigger value="claims" className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4" />
          <span className="hidden sm:inline-block">{t("claims")}</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <PolicyDetailsTab policy={policy} />
      </TabsContent>
      
      <TabsContent value="documents">
        <PolicyDocumentsTab policyId={policy.id} />
      </TabsContent>
      
      <TabsContent value="payments">
        <PolicyPaymentsTab policyId={policy.id} />
      </TabsContent>
      
      <TabsContent value="financials">
        <PolicyFinancialsTab policyId={policy.id} />
      </TabsContent>
      
      <TabsContent value="claims">
        <PolicyClaimsTab policyId={policy.id} />
      </TabsContent>
    </Tabs>
  );
};

export default PolicyTabs;
