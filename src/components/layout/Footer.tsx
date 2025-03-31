
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "border-t border-border py-4 px-6 text-center text-sm text-muted-foreground",
      className
    )}>
      <div className="flex justify-between items-center">
        <div>
          <p>
            &copy; {currentYear} {t("policyHub")}. {t("allRightsReserved")}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            {t("privacyPolicy")}
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            {t("termsOfService")}
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            {t("contact")}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
