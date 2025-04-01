
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilePlus, Search, Filter } from "lucide-react";
import AuthorizationsTable from "@/components/sales/authorizations/AuthorizationsTable";
import AuthorizationUploadDialog from "@/components/sales/authorizations/AuthorizationUploadDialog";
import AuthorizationFilters from "@/components/sales/authorizations/AuthorizationFilters";

const ClientAuthorizations = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("clientAuthorizations")}</h1>
          <p className="text-muted-foreground">
            {t("clientAuthorizationsDescription")}
          </p>
        </div>
        
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <FilePlus className="mr-2 h-4 w-4" />
          {t("uploadAuthorization")}
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle>{t("authorizationForms")}</CardTitle>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                {showFilters ? t("hideFilters") : t("showFilters")}
              </Button>
            </div>
          </div>
          <CardDescription>{t("manageClientAuthorizationForms")}</CardDescription>
        </CardHeader>
        <CardContent>
          {showFilters && (
            <div className="mb-4">
              <AuthorizationFilters />
            </div>
          )}
          
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchAuthorizations")}
                className="pl-9"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          <AuthorizationsTable searchTerm={searchTerm} />
        </CardContent>
      </Card>
      
      <AuthorizationUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </div>
  );
};

export default ClientAuthorizations;
