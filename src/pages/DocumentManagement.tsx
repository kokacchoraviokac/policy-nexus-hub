
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/common";
import { Button } from "@/components/ui/button";
import { Upload, Filter, Search as SearchIcon } from "lucide-react";
import DocumentSearch from "@/components/documents/search/DocumentSearch";
import DocumentBatchUpload from "@/components/documents/unified/DocumentBatchUpload";
import { EntityType } from "@/types/documents";

const DocumentManagement: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("search");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title={t("documentManagement")}
        subtitle={t("manageAllDocumentsInOnePlace")}
      />
      
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center mb-6">
        <Tabs 
          defaultValue={activeTab} 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full sm:w-auto mt-4 sm:mt-0"
        >
          <TabsList>
            <TabsTrigger value="search" className="flex items-center">
              <SearchIcon className="h-4 w-4 mr-2" />
              {t("search")}
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              {t("approved")}
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              {t("pending")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-6">
            <DocumentSearch />
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            <DocumentSearch />
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <DocumentSearch />
          </TabsContent>
        </Tabs>
        
        <div>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            {t("uploadDocuments")}
          </Button>
        </div>
      </div>
      
      <DocumentBatchUpload
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        entityType={"policy" as EntityType} // Default entity type
        entityId={"0"} // Default ID, would be updated when a specific entity is selected
        onSuccess={() => {
          // Refresh document list after upload
          setActiveTab("search");
        }}
      />
    </div>
  );
};

export default DocumentManagement;
