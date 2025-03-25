
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage, Language } from '@/contexts/LanguageContext';

// Map of language codes to their display names
const languageNames: Record<Language, string> = {
  en: 'English',
  sr: 'Српски',
  mk: 'Македонски',
  es: 'Español'
};

// Map of language codes to their country flags (using emoji)
const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  sr: '🇷🇸',
  mk: '🇲🇰',
  es: '🇪🇸'
};

interface LanguageSelectorProps {
  variant?: 'default' | 'compact';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'default' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
          {variant === 'default' ? (
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{languageNames[language]}</span>
            </span>
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        {Object.entries(languageNames).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as Language)}
            className={`cursor-pointer ${code === language ? 'bg-accent font-medium' : ''}`}
          >
            <span className="mr-2">{languageFlags[code as Language]}</span>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
