
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("privacyPolicy")}
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("termsOfService")}
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("contact")}
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
