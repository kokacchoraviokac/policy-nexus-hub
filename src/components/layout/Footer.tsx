
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LanguageSelector from "../language/LanguageSelector";

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-card border-t border-border mt-auto py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear}</span>
            <span className="font-medium">Policy<span className="text-sidebar-primary">Hub</span></span>
            <span>{t("allRightsReserved")}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                {t("termsOfService")}
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                {t("privacyPolicy")}
              </a>
              <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
                {t("help")}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-6" />
            
            <LanguageSelector variant="minimal" />
            
            <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
              <span>{t("madeWith")}</span>
              <Heart className="h-3 w-3 text-destructive fill-destructive" />
            </div>
          </div>
        </div>
        
        <div className="md:hidden flex justify-center mt-4 gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            {t("termsOfService")}
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            {t("privacyPolicy")}
          </a>
          <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
            {t("help")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
