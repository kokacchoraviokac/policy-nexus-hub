
import React, { useState, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/common";
import { Button } from "@/components/ui/button";
import { Upload, Filter, Search as SearchIcon, Loader2 } from "lucide-react";
import { EntityType } from "@/types/documents";

// Lazy load the document components
const DocumentSearch = React.lazy(() => import("@/components/documents/search/DocumentSearch"));
const DocumentBatchUpload = React.lazy(() => import("@/components/documents/unified/DocumentBatchUpload"));

// Loading fallback component
const ComponentLoader = () => (
  <div className="flex justify-center items-center p-12">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const DocumentManagement: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("search");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<ComponentLoader />}>
        <PageHeader
          title={t("documentManagement")}
          subtitle={t("manageAllDocumentsInOnePlace")}
        />
      </Suspense>
      
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
            <Suspense fallback={<ComponentLoader />}>
              <DocumentSearch />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            <Suspense fallback={<ComponentLoader />}>
              <DocumentSearch filterStatus="approved" />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <Suspense fallback={<ComponentLoader />}>
              <DocumentSearch filterStatus="pending" />
            </Suspense>
          </TabsContent>
        </Tabs>
        
        <div>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            {t("uploadDocuments")}
          </Button>
        </div>
      </div>
      
      <Suspense fallback={null}>
        {uploadDialogOpen && (
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
        )}
      </Suspense>
    </div>
  );
};

export default DocumentManagement;
