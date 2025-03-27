/**
 * Translation Export Manager
 * 
 * Utilities for exporting translation keys to CSV files
 */

import en from '../../../locales/en.json';
import sr from '../../../locales/sr/index';
import mk from '../../../locales/mk/index';
import es from '../../../locales/es/index';
import { generateTranslationReport } from '../../translationValidator';
import { Language } from '@/contexts/LanguageContext';

/**
 * Creates a CSV string for missing translations
 */
export const exportMissingTranslations = (language?: Language) => {
  const report = generateTranslationReport();
  
  // If no language specified, export all languages
  const languagesToExport = language ? [language] : ['sr', 'mk', 'es'];
  let csvContent = "key,english";
  
  languagesToExport.forEach(lang => {
    csvContent += `,${lang}`;
  });
  
  csvContent += "\n";
  
  // Get all keys from English as the source
  const sourceKeys = Object.keys(en);
  
  sourceKeys.forEach(key => {
    const englishText = en[key].replace(/,/g, '\\,').replace(/\n/g, '\\n');
    let row = `"${key}","${englishText}"`;
    
    languagesToExport.forEach(lang => {
      const targetLang = lang as Language;
      const translations = { sr, mk, es };
      
      if (report.missingKeys[targetLang].includes(key)) {
        // Missing translation
        row += `,""`;
      } else {
        // Existing translation
        const text = translations[targetLang][key].replace(/,/g, '\\,').replace(/\n/g, '\\n');
        row += `,${text ? `"${text}"` : ''}`;
      }
    });
    
    csvContent += row + "\n";
  });
  
  // Create a downloadable file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", language 
    ? `policyhub_translations_${language}.csv` 
    : "policyhub_translations_all.csv");
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log(`Exported translations to CSV${language ? ` for ${language.toUpperCase()}` : ''}`);
  return csvContent;
};
