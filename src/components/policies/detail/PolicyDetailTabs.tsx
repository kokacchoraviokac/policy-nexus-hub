
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import PolicyDocumentsTab from "./PolicyDocumentsTab";
import PolicyClaimsTab from "./PolicyClaimsTab";
import PolicyFinancialsTab from "./PolicyFinancialsTab";
import PolicyHistoryTab from "./PolicyHistoryTab";

interface PolicyDetailTabsProps {
  policy: any; // Will be properly typed when we have the full schema
}

const PolicyDetailTabs: React.FC<PolicyDetailTabsProps> = ({ policy }) => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="documents" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="documents">
          {t("documents")}
          {policy.documents_count > 0 && (
            <Badge variant="secondary" className="ml-2">{policy.documents_count}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="claims">
          {t("claims")}
          {policy.claims_count > 0 && (
            <Badge variant="secondary" className="ml-2">{policy.claims_count}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="financials">{t("financials")}</TabsTrigger>
        <TabsTrigger value="history">{t("history")}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="documents">
        <PolicyDocumentsTab policyId={policy.id} />
      </TabsContent>
      
      <TabsContent value="claims">
        <PolicyClaimsTab policyId={policy.id} />
      </TabsContent>
      
      <TabsContent value="financials">
        <PolicyFinancialsTab policyId={policy.id} />
      </TabsContent>
      
      <TabsContent value="history">
        <PolicyHistoryTab policyId={policy.id} />
      </TabsContent>
    </Tabs>
  );
};

export default PolicyDetailTabs;
