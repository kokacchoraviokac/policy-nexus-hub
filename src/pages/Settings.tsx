
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Building, FileText, Mail, Shield } from "lucide-react";
import CompanyManagement from "@/components/settings/CompanyManagement";
import InvitationManagement from "@/components/settings/InvitationManagement";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings = () => {
  const { hasPrivilege } = useAuth();
  const { t } = useLanguage();
  
  const canManageUsers = hasPrivilege("users:manage");
  const isSuperAdmin = hasPrivilege("company:manage");
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("settings")}</h1>
        <p className="text-muted-foreground">
          {t("settingsDescription")}
        </p>
      </div>
      
      {isSuperAdmin && (
        <div className="mt-8">
          <CompanyManagement />
        </div>
      )}
      
      {/* Invitation Management */}
      <div className="mt-8">
        <InvitationManagement />
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {canManageUsers && (
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>{t("userManagement")}</CardTitle>
              </div>
              <CardDescription>
                {t("userManagementDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("userManagementDescription")}
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/settings/users">{t("manageUsers")}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle>{t("companyData")}</CardTitle>
            </div>
            <CardDescription>
              {t("companyDataDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t("companyDataDescription")}
            </p>
            <Button variant="outline" className="w-full" disabled>
              {t("editCompanyData")}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>{t("instructions")}</CardTitle>
            </div>
            <CardDescription>
              {t("instructionsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t("instructionsDescription")}
            </p>
            <Button variant="outline" className="w-full" disabled>
              {t("manageInstructions")}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>{t("emailSettings")}</CardTitle>
            </div>
            <CardDescription>
              {t("emailSettingsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t("emailSettingsDescription")}
            </p>
            <Button variant="outline" className="w-full" disabled>
              {t("configureEmail")}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>{t("privilegeTesting")}</CardTitle>
            </div>
            <CardDescription>
              {t("privilegeTestingDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t("privilegeTestingDescription")}
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/settings/privileges/test">{t("testPrivileges")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
