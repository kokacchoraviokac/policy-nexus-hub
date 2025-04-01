
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import PolicyOverviewTab from "./PolicyOverviewTab";
import PolicyClaimsTab from "./PolicyClaimsTab";
import PolicyFinancialsTab from "./PolicyFinancialsTab";
import PolicyDocumentsTab from "./PolicyDocumentsTab";
import PolicyAddendaTab from "./PolicyAddendaTab";
import PolicyActivityTab from "./PolicyActivityTab";
import PolicyPaymentsTab from "./PolicyPaymentsTab";

interface PolicyDetailTabsProps {
  policy: any;
}

const PolicyDetailTabs: React.FC<PolicyDetailTabsProps> = ({ policy }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <Tabs 
      defaultValue="overview" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <TabsList className="grid grid-cols-7 w-full">
        <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
        <TabsTrigger value="claims">{t("claims")}</TabsTrigger>
        <TabsTrigger value="financials">{t("financials")}</TabsTrigger>
        <TabsTrigger value="payments">{t("payments")}</TabsTrigger>
        <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
        <TabsTrigger value="addenda" data-value="addenda">{t("addenda")}</TabsTrigger>
        <TabsTrigger value="activity">{t("activity")}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <PolicyOverviewTab policy={policy} />
      </TabsContent>
      
      <TabsContent value="claims" className="space-y-4">
        <PolicyClaimsTab policyId={policy.id} />
      </TabsContent>
      
      <TabsContent value="financials" className="space-y-4">
        <PolicyFinancialsTab policyId={policy.id} />
      </TabsContent>
      
      <TabsContent value="payments" className="space-y-4">
        <PolicyPaymentsTab policyId={policy.id} />
      </TabsContent>
      
      <TabsContent value="documents" className="space-y-4">
        <PolicyDocumentsTab policyId={policy.id} />
      </TabsContent>
      
      <TabsContent value="addenda" className="space-y-4">
        <PolicyAddendaTab policyId={policy.id} />
      </TabsContent>
      
      <TabsContent value="activity" className="space-y-4">
        <PolicyActivityTab policyId={policy.id} />
      </TabsContent>
    </Tabs>
  );
};

export default PolicyDetailTabs;
