
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Users, Building2, Tag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ClientsDirectory from "@/components/codebook/ClientsDirectory";
import InsurersDirectory from "@/components/codebook/InsurersDirectory";
import ProductCodesDirectory from "@/components/codebook/ProductCodesDirectory";

const Codebook = () => {
  const [activeTab, setActiveTab] = useState("clients");
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Book className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Codebook</h1>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Manage master data including clients, insurance companies, and product codes.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="clients" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Clients</span>
          </TabsTrigger>
          <TabsTrigger value="insurers" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Insurers</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span>Products</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients" className="space-y-4">
          <ClientsDirectory />
        </TabsContent>
        
        <TabsContent value="insurers" className="space-y-4">
          <InsurersDirectory />
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <ProductCodesDirectory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Codebook;
