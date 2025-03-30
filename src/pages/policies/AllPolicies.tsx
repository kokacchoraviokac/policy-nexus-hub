
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import PoliciesTable from "@/components/policies/PoliciesTable";
import PoliciesFilters from "@/components/policies/PoliciesFilters";
import PolicyStatistics from "@/components/policies/PolicyStatistics";

const AllPolicies = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const handleRefresh = () => {
    // Trigger refetch of policies data
  };
  
  const handleViewPolicy = (policyId: string) => {
    // Navigate to policy details page
    navigate(`/policies/${policyId}`);
  };
  
  const handleEditPolicy = (policyId: string) => {
    // Navigate to policy edit page
    navigate(`/policies/workflow/${policyId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("allPolicies")}</h1>
        <p className="text-muted-foreground">
          {t("allPoliciesDescription")}
        </p>
      </div>
      
      <PolicyStatistics />
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-4">{t("policyDirectory")}</h2>
          
          <PoliciesFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onRefresh={handleRefresh}
          />
        </div>
        
        <div>
          <PoliciesTable 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onViewPolicy={handleViewPolicy}
            onEditPolicy={handleEditPolicy}
          />
        </div>
      </Card>
    </div>
  );
};

export default AllPolicies;
