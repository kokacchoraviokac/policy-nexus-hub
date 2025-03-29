
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, FileBox, Workflow, FileArchive, CreditCard, FileImage } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

import PoliciesTable from "@/components/policies/PoliciesTable";
import PoliciesFilters from "@/components/policies/PoliciesFilters";
import PolicyStatistics from "@/components/policies/PolicyStatistics";

const Policies = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { refetch } = useQuery({
    queryKey: ['policies-refetch-trigger'],
    queryFn: async () => null,
    enabled: false,
  });
  
  useEffect(() => {
    // Log that the Policies component is mounted
    console.log("Policies component mounted");
    return () => {
      console.log("Policies component unmounted");
    };
  }, []);
  
  const handleRefresh = () => {
    refetch();
  };
  
  const handleViewPolicy = (policyId: string) => {
    // Navigate to policy details page
    navigate(`/policies/${policyId}`);
  };
  
  const handleEditPolicy = (policyId: string) => {
    // Navigate to policy edit page
    navigate(`/policies/${policyId}/edit`);
  };
  
  const handleCreatePolicy = () => {
    // Navigate to policy creation page
    navigate("/policies/new");
  };

  const policyModules = [
    {
      title: "allPolicies",
      description: "allPoliciesDescription",
      path: "/policies",
      icon: FileBox
    },
    {
      title: "policiesWorkflow",
      description: "policiesWorkflowDescription",
      path: "/policies/workflow",
      icon: Workflow
    },
    {
      title: "policyAddendums",
      description: "policyAddendumsDescription",
      path: "/policies/addendums",
      icon: FileArchive
    },
    {
      title: "unlinkedPayments",
      description: "unlinkedPaymentsDescription",
      path: "/policies/unlinked-payments",
      icon: CreditCard
    },
    {
      title: "documents",
      description: "documentsDescription",
      path: "/policies/documents",
      icon: FileImage
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("policies")}</h1>
          <p className="text-muted-foreground">
            {t("policyManagement")}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleCreatePolicy}>
            <FilePlus className="mr-2 h-4 w-4" />
            {t("newPolicy")}
          </Button>
        </div>
      </div>
      
      {/* Policy Modules Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {policyModules.map((module, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-0">
              <Button 
                variant="ghost" 
                className="w-full h-full p-4 flex items-start justify-start text-left space-x-4"
                onClick={() => navigate(module.path)}
              >
                <module.icon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">{t(module.title)}</h3>
                  <p className="text-sm text-muted-foreground">{t(module.description)}</p>
                </div>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <PolicyStatistics />
      
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-border">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-4">{t("policyManagement")}</h2>
          
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
      </div>
    </div>
  );
};

export default Policies;
