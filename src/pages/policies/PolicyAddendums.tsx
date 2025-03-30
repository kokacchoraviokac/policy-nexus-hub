
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddendumList from "@/components/policies/addendums/AddendumList";
import SelectAddendumPolicyDialog from "@/components/policies/addendums/SelectAddendumPolicyDialog";

const PolicyAddendums = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showSelectPolicyDialog, setShowSelectPolicyDialog] = useState(false);
  
  const handleAddAddendum = () => {
    setShowSelectPolicyDialog(true);
  };
  
  const handlePolicySelected = (policyId: string) => {
    // This would typically open an addendum form dialog for the selected policy
    // or navigate to a dedicated addendum creation page
    setShowSelectPolicyDialog(false);
    toast({
      title: t("addendumCreation"),
      description: t("preparingAddendumForm"),
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("policyAddendums")}</h1>
          <p className="text-muted-foreground">
            {t("policyAddendumsDescription")}
          </p>
        </div>
        
        <Button onClick={handleAddAddendum} className="md:w-auto w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("addAddendum")}
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("addendumsManagement")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchAddendums")}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="draft">{t("draft")}</SelectItem>
                <SelectItem value="pending">{t("pending")}</SelectItem>
                <SelectItem value="approved">{t("approved")}</SelectItem>
                <SelectItem value="rejected">{t("rejected")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <AddendumList 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
        </CardContent>
      </Card>
      
      <SelectAddendumPolicyDialog 
        open={showSelectPolicyDialog}
        onClose={() => setShowSelectPolicyDialog(false)}
        onPolicySelected={handlePolicySelected}
      />
    </div>
  );
};

export default PolicyAddendums;
