
import React from "react";
import PrivilegeTest from "@/components/auth/PrivilegeTest";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivilegeTestPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("privilegeTesting")}</h1>
        <p className="text-muted-foreground">
          {t("privilegeTestingDescription")}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <PrivilegeTest />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("howToUseThisTool")}</CardTitle>
            <CardDescription>
              {t("verifyPermissionSystem")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">{t("simplePermissionCheck")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("simplePermissionCheckDescription")}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">{t("contextBasedPermissionCheck")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("contextBasedPermissionCheckDescription")}
              </p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2">
                <li>For "own resource" checks, set Owner ID to the current user's ID</li>
                <li>For company-specific checks, set Company ID to the current user's company</li>
                <li>For value-based checks (like high-value claims), use Resource Type "amount"</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">{t("examplePermissionsToTest")}</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5">
                <li>policies:view - Can view policies module</li>
                <li>policies.own:edit - Can edit own policies</li>
                <li>claims.highValue:edit - Can edit high-value claims</li>
                <li>finances.commissions.company:view - Can view commissions for their company</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivilegeTestPage;
