
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilePlus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PolicyDocumentsTable from "@/components/policies/documents/PolicyDocumentsTable";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";

const PolicyDocuments = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
  };
  
  const handleUploadComplete = () => {
    toast({
      title: t("documentUploaded"),
      description: t("documentUploadedSuccess"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("policyDocuments")}</h1>
          <p className="text-muted-foreground">
            {t("policyDocumentsDescription")}
          </p>
        </div>
        
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <FilePlus className="mr-2 h-4 w-4" />
          {t("uploadDocument")}
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("documentRepository")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchDocuments")}
                className="pl-9"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <Select
              value={documentType}
              onValueChange={handleDocumentTypeChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("filterByType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allDocuments")}</SelectItem>
                <SelectItem value="policy">{t("policies")}</SelectItem>
                <SelectItem value="addendum">{t("addendums")}</SelectItem>
                <SelectItem value="invoice">{t("invoices")}</SelectItem>
                <SelectItem value="claim">{t("claims")}</SelectItem>
                <SelectItem value="other">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <PolicyDocumentsTable 
            searchTerm={searchTerm}
            documentType={documentType}
          />
        </CardContent>
      </Card>
      
      <DocumentUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        entityType="policy" 
        entityId="general" // This would normally be a specific policy ID
      />
    </div>
  );
};

export default PolicyDocuments;
