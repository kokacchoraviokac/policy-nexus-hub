
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Globe } from "lucide-react";

interface LanguageOption {
  code: Language;
  label: string;
  flag?: string;
}

const languages: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "sr", label: "Serbian", flag: "🇷🇸" },
  { code: "mk", label: "Macedonian", flag: "🇲🇰" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
];

const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between"
          >
            <span>
              {lang.flag && <span className="mr-2">{lang.flag}</span>}
              {lang.label}
            </span>
            {currentLanguage === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
