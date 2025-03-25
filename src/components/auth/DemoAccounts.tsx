
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const DemoAccounts: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center text-sm text-muted-foreground mt-4">
      <div className="mb-2">
        {t("demoAccounts")}
      </div>
      <div className="grid grid-cols-1 gap-1">
        <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-xs">
          superadmin@policyhub.com ({t("superAdmin")})
        </code>
        <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-xs">
          admin@example.com ({t("brokerAdmin")})
        </code>
        <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-xs">
          employee@example.com ({t("employee")})
        </code>
      </div>
      <div className="mt-2 text-xs">
        {t("passwordAny")}
      </div>
    </div>
  );
};

export default DemoAccounts;
