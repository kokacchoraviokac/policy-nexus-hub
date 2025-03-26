
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
  variant?: 'default' | 'compact' | 'minimal' | 'outline';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'default' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'minimal' ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1.5 h-8 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-base">{languageFlags[language]}</span>
            <span className="sr-only">Select language</span>
          </Button>
        ) : variant === 'compact' ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 py-1 rounded-md"
          >
            <Globe className="h-4 w-4 mr-1" />
            <span className="text-sm">{language.toUpperCase()}</span>
          </Button>
        ) : variant === 'outline' ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 bg-background/60 backdrop-blur-sm border-muted flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-background/80"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-normal">{languageNames[language]}</span>
            <span className="text-xs opacity-80">{language.toUpperCase()}</span>
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 bg-background/60 backdrop-blur-sm border-muted flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-background/80"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-normal">{languageNames[language]}</span>
            <span className="text-xs opacity-80">{language.toUpperCase()}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border-border w-36">
        {Object.entries(languageNames).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as Language)}
            className={`cursor-pointer flex items-center gap-2 ${code === language ? 'bg-accent/50 font-medium' : ''}`}
          >
            <span className="text-base">{languageFlags[code as Language]}</span>
            <span className="text-sm">{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
