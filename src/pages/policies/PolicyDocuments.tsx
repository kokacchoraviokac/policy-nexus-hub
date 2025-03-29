
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Search, FileUp, Filter, Download, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchInput from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";
import { useToast } from "@/hooks/use-toast";
import PolicyDocumentsTable from "@/components/policies/documents/PolicyDocumentsTable";

const PolicyDocuments = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const handleUploadDocument = () => {
    setUploadDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("documents")}</h1>
          <p className="text-muted-foreground">
            {t("policyDocumentsDescription")}
          </p>
        </div>
        <Button onClick={handleUploadDocument}>
          <FileUp className="mr-2 h-4 w-4" />
          {t("uploadDocument")}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("documentManagement")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-6 grid grid-cols-3 md:grid-cols-5 lg:w-auto">
              <TabsTrigger value="all">{t("allDocuments")}</TabsTrigger>
              <TabsTrigger value="policy">{t("policyDocuments")}</TabsTrigger>
              <TabsTrigger value="invoice">{t("invoices")}</TabsTrigger>
              <TabsTrigger value="certificate">{t("certificates")}</TabsTrigger>
              <TabsTrigger value="other">{t("otherDocuments")}</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <SearchInput
                  placeholder={t("searchDocuments")}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={documentType} onValueChange={handleDocumentTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("selectDocumentType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allTypes")}</SelectItem>
                    <SelectItem value="policy">{t("policyDocument")}</SelectItem>
                    <SelectItem value="invoice">{t("invoice")}</SelectItem>
                    <SelectItem value="certificate">{t("certificate")}</SelectItem>
                    <SelectItem value="endorsement">{t("endorsement")}</SelectItem>
                    <SelectItem value="other">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all">
              <PolicyDocumentsTable 
                searchTerm={searchTerm} 
                documentType={documentType === "all" ? undefined : documentType}
              />
            </TabsContent>
            
            <TabsContent value="policy">
              <PolicyDocumentsTable 
                searchTerm={searchTerm} 
                documentType="policy"
              />
            </TabsContent>
            
            <TabsContent value="invoice">
              <PolicyDocumentsTable 
                searchTerm={searchTerm} 
                documentType="invoice"
              />
            </TabsContent>
            
            <TabsContent value="certificate">
              <PolicyDocumentsTable 
                searchTerm={searchTerm} 
                documentType="certificate"
              />
            </TabsContent>
            
            <TabsContent value="other">
              <PolicyDocumentsTable 
                searchTerm={searchTerm} 
                documentType={documentType !== "all" ? documentType : "other"}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        entityType="policy"
        entityId="global"
      />
    </div>
  );
};

export default PolicyDocuments;
