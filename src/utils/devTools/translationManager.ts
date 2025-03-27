/**
 * Translation Manager - Development Tool
 * 
 * This utility helps manage translations across different language files.
 * It provides functions to:
 * 1. Export translation keys that need attention
 * 2. Import updated translations
 * 3. Track translation workflow status
 * 
 * Usage in browser console:
 *   import('/src/utils/devTools/translationManager.js').then(m => m.exportMissingTranslations())
 */

import en from '../../locales/en.json';
import sr from '../../locales/sr.json';
import mk from '../../locales/mk.json';
import es from '../../locales/es.json';
import { generateTranslationReport } from '../translationValidator';
import { Language } from '@/contexts/LanguageContext';

/**
 * Status of a translation key workflow
 */
type TranslationStatus = 'complete' | 'missing' | 'needs-review' | 'in-progress';

/**
 * A record to track translation workflow
 */
interface TranslationWorkflow {
  key: string;
  english: string;
  languages: Record<string, {
    text: string;
    status: TranslationStatus;
    lastUpdated?: string;
  }>;
}

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

/**
 * Generates a workflow status for all translations
 */
export const generateTranslationWorkflow = (): TranslationWorkflow[] => {
  const report = generateTranslationReport();
  const allKeys = Object.keys(en);
  const workflow: TranslationWorkflow[] = [];
  
  allKeys.forEach(key => {
    const workflowItem: TranslationWorkflow = {
      key,
      english: en[key],
      languages: {}
    };
    
    // Check status for each language
    ['sr', 'mk', 'es'].forEach(lang => {
      const targetLang = lang as Language;
      const translations = { sr, mk, es };
      
      if (report.missingKeys[targetLang].includes(key)) {
        // Missing translation
        workflowItem.languages[targetLang] = {
          text: '',
          status: 'missing'
        };
      } else {
        // Translation exists
        workflowItem.languages[targetLang] = {
          text: translations[targetLang][key],
          status: 'complete'
        };
      }
    });
    
    workflow.push(workflowItem);
  });
  
  return workflow;
};

/**
 * Displays a report of translation workflow status in the console
 */
export const reportTranslationWorkflow = () => {
  const workflow = generateTranslationWorkflow();
  const total = workflow.length;
  
  // Count status by language
  const stats = {
    sr: { complete: 0, missing: 0, 'needs-review': 0, 'in-progress': 0 },
    mk: { complete: 0, missing: 0, 'needs-review': 0, 'in-progress': 0 },
    es: { complete: 0, missing: 0, 'needs-review': 0, 'in-progress': 0 }
  };
  
  workflow.forEach(item => {
    Object.entries(item.languages).forEach(([lang, data]) => {
      stats[lang as 'sr' | 'mk' | 'es'][data.status]++;
    });
  });
  
  console.group('📋 Translation Workflow Status');
  
  console.log(`Total translation keys: ${total}`);
  
  console.table({
    'Language': ['Serbian', 'Macedonian', 'Spanish'],
    'Complete': [
      `${stats.sr.complete} (${Math.round((stats.sr.complete / total) * 100)}%)`,
      `${stats.mk.complete} (${Math.round((stats.mk.complete / total) * 100)}%)`,
      `${stats.es.complete} (${Math.round((stats.es.complete / total) * 100)}%)`
    ],
    'Missing': [
      `${stats.sr.missing} (${Math.round((stats.sr.missing / total) * 100)}%)`,
      `${stats.mk.missing} (${Math.round((stats.mk.missing / total) * 100)}%)`,
      `${stats.es.missing} (${Math.round((stats.es.missing / total) * 100)}%)`
    ],
    'Needs Review': [
      `${stats.sr['needs-review']} (${Math.round((stats.sr['needs-review'] / total) * 100)}%)`,
      `${stats.mk['needs-review']} (${Math.round((stats.mk['needs-review'] / total) * 100)}%)`,
      `${stats.es['needs-review']} (${Math.round((stats.es['needs-review'] / total) * 100)}%)`
    ],
    'In Progress': [
      `${stats.sr['in-progress']} (${Math.round((stats.sr['in-progress'] / total) * 100)}%)`,
      `${stats.mk['in-progress']} (${Math.round((stats.mk['in-progress'] / total) * 100)}%)`,
      `${stats.es['in-progress']} (${Math.round((stats.es['in-progress'] / total) * 100)}%)`
    ]
  });
  
  // Provide recommendations for the next steps
  console.group('📝 Recommendations');
  
  // Find the language with the most missing translations
  const missingCounts = [
    { lang: 'Serbian', count: stats.sr.missing },
    { lang: 'Macedonian', count: stats.mk.missing },
    { lang: 'Spanish', count: stats.es.missing }
  ].sort((a, b) => b.count - a.count);
  
  if (missingCounts[0].count > 0) {
    console.log(`1. Focus on ${missingCounts[0].lang} translations first, which has ${missingCounts[0].count} missing keys.`);
    console.log(`   Run: window.__translationManager.exportMissingTranslations('${missingCounts[0].lang.toLowerCase().substring(0, 2)}')`);
  } else {
    console.log('1. All translations are complete! Consider reviewing for quality.');
  }
  
  console.log('2. Use the exported CSV file to work with translators outside the application.');
  console.log('3. When translations are ready, import them back into the application.');
  
  console.groupEnd(); // Recommendations
  console.groupEnd(); // Translation Workflow Status
  
  return { workflow, stats };
};

// Create a global access point for the translation manager in development
if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  window.__translationManager = {
    exportMissingTranslations,
    generateTranslationWorkflow,
    reportTranslationWorkflow
  };
  
  console.log('Translation manager available. Use these functions in the console:');
  console.log('- window.__translationManager.exportMissingTranslations()');
  console.log('- window.__translationManager.reportTranslationWorkflow()');
}

export default {
  exportMissingTranslations,
  generateTranslationWorkflow,
  reportTranslationWorkflow
};
