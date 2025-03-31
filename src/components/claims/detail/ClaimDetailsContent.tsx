
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload, Clock } from "lucide-react";
import ClaimInfoTab from "./ClaimInfoTab";
import ClaimDocumentsTab from "./ClaimDocumentsTab";
import ClaimHistoryTab from "./ClaimHistoryTab";

interface ClaimDetailsContentProps {
  claim: any;
  onUploadClick: () => void;
}

const ClaimDetailsContent: React.FC<ClaimDetailsContentProps> = ({
  claim,
  onUploadClick
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("info");
  
  return (
    <Tabs 
      defaultValue="info" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="info">{t("details")}</TabsTrigger>
          <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
          <TabsTrigger value="history">{t("history")}</TabsTrigger>
        </TabsList>
        
        {activeTab === "documents" && (
          <Button size="sm" onClick={onUploadClick}>
            <Upload className="mr-2 h-4 w-4" />
            {t("uploadDocument")}
          </Button>
        )}
      </div>
      
      <TabsContent value="info" className="space-y-4">
        <ClaimInfoTab claim={claim} />
      </TabsContent>
      
      <TabsContent value="documents" className="space-y-4">
        <ClaimDocumentsTab claimId={claim.id} />
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4">
        <ClaimHistoryTab claim={claim} />
      </TabsContent>
    </Tabs>
  );
};

export default ClaimDetailsContent;
