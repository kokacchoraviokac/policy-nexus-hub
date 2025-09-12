
import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyDetailsForm } from "@/components/settings/company/CompanyDetailsForm";
import { RegionalSettingsForm } from "@/components/settings/company/RegionalSettingsForm";
import { BrandingSettingsForm } from "@/components/settings/company/BrandingSettingsForm";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { Loader2 } from "lucide-react";

interface CompanyData {
  id: string;
  name: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  registration_number?: string;
  tax_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface CompanySettings {
  id: string;
  company_id: string;
  default_language: string;
  default_currency: string;
  date_format: string;
  fiscal_year_start: string;
  enable_notifications: boolean;
  created_at?: string;
  updated_at?: string;
}

const CompanyDataPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanyData = useCallback(async () => {
    setIsLoading(true);
    console.log("Using mock company data for testing");
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock company data
      const mockCompanyData: CompanyData = {
        id: "company-1",
        name: "Policy Hub Demo Company",
        address: "123 Insurance Street",
        city: "Belgrade",
        postal_code: "11000",
        country: "Serbia",
        phone: "+381 11 123 4567",
        registration_number: "REG123456789",
        tax_id: "TAX987654321",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: new Date().toISOString()
      };
      
      // Mock company settings
      const mockCompanySettings: CompanySettings = {
        id: "settings-1",
        company_id: "company-1",
        default_language: "en",
        default_currency: "EUR",
        date_format: "DD/MM/YYYY",
        fiscal_year_start: "01-01",
        enable_notifications: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: new Date().toISOString()
      };
      
      setCompanyData(mockCompanyData);
      setCompanySettings(mockCompanySettings);
      
    } catch (error: any) {
      console.error('Error fetching company data:', error);
      toast.error(t("failedToLoadCompanyData"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (user?.companyId) {
      fetchCompanyData();
    }
  }, [user, fetchCompanyData]);

  const handleCompanyDetailsUpdate = async (updatedData: Partial<CompanyData>) => {
    if (!companyData?.id) return;

    console.log("Updating company details with mock data:", updatedData);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state with new data
      const updatedCompanyData = {
        ...companyData,
        ...updatedData,
        updated_at: new Date().toISOString()
      };
      
      setCompanyData(updatedCompanyData);
      
      // Store in localStorage for persistence
      localStorage.setItem('mockCompanyData', JSON.stringify(updatedCompanyData));
      
      toast.success(t("companyDetailsUpdated"));
    } catch (error: any) {
      console.error('Error updating company details:', error);
      toast.error(t("failedToUpdateCompanyDetails"));
    }
  };

  const handleRegionalSettingsUpdate = async (updatedSettings: Partial<CompanySettings>) => {
    console.log("Updating regional settings with mock data:", updatedSettings);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const updatedCompanySettings = companySettings ?
        { ...companySettings, ...updatedSettings, updated_at: new Date().toISOString() } :
        {
          id: "settings-1",
          company_id: "company-1",
          default_language: "en",
          default_currency: "EUR",
          date_format: "DD/MM/YYYY",
          fiscal_year_start: "01-01",
          enable_notifications: true,
          ...updatedSettings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      
      setCompanySettings(updatedCompanySettings);
      
      // Store in localStorage for persistence
      localStorage.setItem('mockCompanySettings', JSON.stringify(updatedCompanySettings));
      
      toast.success(t("regionalSettingsUpdated"));
    } catch (error: any) {
      console.error('Error updating regional settings:', error);
      toast.error(t("failedToUpdateRegionalSettings"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SettingsHeader 
        title={t("companyData")}
        description={t("companyDataDescription")}
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{t("companySettings")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="border-b rounded-none w-full justify-start">
              <TabsTrigger value="details">{t("companyDetails")}</TabsTrigger>
              <TabsTrigger value="regional">{t("regionalSettings")}</TabsTrigger>
              <TabsTrigger value="branding">{t("branding")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="p-6 space-y-6">
              <CompanyDetailsForm 
                companyData={companyData} 
                onSave={handleCompanyDetailsUpdate} 
              />
            </TabsContent>
            
            <TabsContent value="regional" className="p-6 space-y-6">
              <RegionalSettingsForm 
                settings={companySettings} 
                onSave={handleRegionalSettingsUpdate} 
              />
            </TabsContent>
            
            <TabsContent value="branding" className="p-6 space-y-6">
              <BrandingSettingsForm 
                companyId={companyData?.id}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDataPage;
