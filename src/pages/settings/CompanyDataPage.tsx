
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
    try {
      // Fetch company details
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', user?.companyId)
        .single();

      if (companyError) throw companyError;
      setCompanyData(companyData);

      // Fetch company settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('company_settings')
        .select('*')
        .eq('company_id', user?.companyId)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which might be valid for new companies
        throw settingsError;
      }

      if (settingsData) {
        setCompanySettings(settingsData);
      }
    } catch (error: any) {
      console.error('Error fetching company data:', error);
      toast.error(t("failedToLoadCompanyData"));
    } finally {
      setIsLoading(false);
    }
  }, [user?.companyId, t]);

  useEffect(() => {
    if (user?.companyId) {
      fetchCompanyData();
    }
  }, [user, fetchCompanyData]);

  const handleCompanyDetailsUpdate = async (updatedData: Partial<CompanyData>) => {
    if (!companyData?.id) return;

    try {
      const { error } = await supabase
        .from('companies')
        .update(updatedData)
        .eq('id', companyData.id);

      if (error) throw error;
      
      // Update local state with new data
      setCompanyData({ ...companyData, ...updatedData });
      toast.success(t("companyDetailsUpdated"));
    } catch (error: any) {
      console.error('Error updating company details:', error);
      toast.error(t("failedToUpdateCompanyDetails"));
    }
  };

  const handleRegionalSettingsUpdate = async (updatedSettings: Partial<CompanySettings>) => {
    if (!user?.companyId) return;

    try {
      if (companySettings?.id) {
        // Update existing settings
        const { error } = await supabase
          .from('company_settings')
          .update(updatedSettings)
          .eq('id', companySettings.id);

        if (error) throw error;
      } else {
        // Create new settings if they don't exist
        const { error } = await supabase
          .from('company_settings')
          .insert({
            company_id: user.companyId,
            ...updatedSettings
          });

        if (error) throw error;
        
        // Refresh settings after creation
        fetchCompanyData();
      }
      
      // Update local state
      if (companySettings) {
        setCompanySettings({ ...companySettings, ...updatedSettings });
      }
      
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
