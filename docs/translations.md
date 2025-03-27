
# Policy Hub Translation System Documentation

## Overview

Policy Hub uses a modular internationalization (i18n) system that supports multiple languages (English, Serbian, Macedonian, and Spanish) with a structured file organization. This document explains how the translation system works, how to add new translations, and best practices for maintaining translations.

## Translation File Structure

### Directory Structure

```
src/
└── locales/
    ├── en.json              # English translations (flat file)
    ├── sr/                  # Serbian translations (modular)
    │   ├── index.ts         # Exports combined translations
    │   ├── auth.json        # Authentication translations
    │   ├── common.json      # Common/shared translations
    │   ├── dashboard.json   # Dashboard-specific translations
    │   ├── layout.json      # Layout component translations
    │   ├── modules.json     # Module-specific translations
    │   ├── settings.json    # Settings-specific translations
    │   ├── codebook.json    # Codebook-specific translations
    │   └── errors.json      # Error messages
    ├── mk/                  # Macedonian translations (same structure as Serbian)
    └── es/                  # Spanish translations (same structure as Serbian)
```

### File Organization

1. **English (Source Language)**: 
   - Single flat JSON file (`en.json`) containing all translation keys
   - Used as the reference for other languages

2. **Other Languages (sr, mk, es)**:
   - Modular approach with domain-specific JSON files
   - `index.ts` file that merges and exports all translations

## How Translations Work

### Loading Translations

The `LanguageContext.tsx` component:
1. Loads the appropriate language file based on user preferences
2. Provides translation functions through React context
3. Tracks missing translations during development

### Using Translations

In components, access translations using the `useLanguage` hook:

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();
  
  return <h1>{t('welcome')}</h1>;
};
```

### Development Tools

Several utilities are provided for translation management:

1. **Translation Analyzer** (`/src/utils/devTools/translation/analyzer/`):
   - Checks completion status of translations
   - Identifies inconsistencies between language files
   - Suggests improvements to translations

2. **Translation Manager** (`/src/utils/devTools/translation/`):
   - Exports missing translations to CSV
   - Generates translation workflow reports
   - Tracks translation status

3. **Translation Tester** (`/src/utils/testing/translation/`):
   - Tests translation existence
   - Verifies parameter consistency
   - Validates HTML translations

## Adding New Translations

### Adding a New Translation Key

1. **First add to English**:
   ```json
   // src/locales/en.json
   {
     "existingKey": "Existing value",
     "newKey": "New translation text"
   }
   ```

2. **Then add to other languages**:
   - Identify the appropriate category file (auth, common, dashboard, etc.)
   - Add the same key with the translated text

   ```json
   // src/locales/es/common.json (example)
   {
     "existingKey": "Valor existente",
     "newKey": "Nuevo texto traducido"
   }
   ```

### Adding a New Language

1. Create a new directory under `src/locales/` (e.g., `fr/` for French)
2. Create JSON files for each category (copy structure from existing languages)
3. Create an `index.ts` file to merge and export translations:

```typescript
// src/locales/fr/index.ts
import auth from './auth.json';
import common from './common.json';
import dashboard from './dashboard.json';
// ... import other files

// Merge all translation objects
const translations = {
  ...common,
  ...auth,
  ...dashboard,
  // ... spread other objects
};

export default translations;
```

4. Update `LanguageContext.tsx` to support the new language code

## Best Practices

### Key Naming Conventions

1. **Use descriptive keys**: 
   - Good: `userProfileTitle` 
   - Avoid: `title1`

2. **Use camelCase** for all translation keys

3. **Group related keys** with prefixes:
   - `button.save`, `button.cancel`, etc.
   - `error.notFound`, `error.unauthorized`, etc.

### Translation Organization

1. **Domain Separation**:
   - Place translations in the appropriate domain file
   - `auth.json` for authentication-related strings
   - `common.json` for widely used strings

2. **Avoid Duplication**:
   - Use the same key for identical text across the application
   - Place in `common.json` if used in multiple domains

### Dynamic Content

1. **Use parameters** for dynamic content:
   ```json
   {
     "deleteConfirmation": "Are you sure you want to delete <span class=\"font-medium\">{0}</span>?"
   }
   ```

   ```tsx
   // In component
   const message = processDynamicTranslation(
     t("deleteConfirmation"), 
     { 0: `<span class="font-medium">${entityTitle}</span>` }
   );
   // Then use dangerouslySetInnerHTML to render the HTML
   ```

### Development Workflow

1. **Use Analysis Tools**:
   - Run `window.__analyzeTranslations()` in browser console to check translation status
   - Export missing translations with `window.__translationManager.exportMissingTranslations()`
   - Test translations with `window.__runTranslationTests()`

2. **Regular Audits**:
   - Periodically check for missing translations
   - Review translation consistency across languages

## Translation Components

For ease of use, several React components are provided:

1. **TranslationStatus**: Shows completion status of translations
2. **TranslationManager**: Development tool for managing translations
3. **TranslationTestStatus**: Runs tests on translations

## Advanced Usage

### Formatting Values

The `LanguageContext` provides several formatting functions:

```tsx
const { 
  formatDate, 
  formatNumber, 
  formatCurrency, 
  formatRelativeTime 
} = useLanguage();

// Usage
<p>{formatDate(new Date())}</p>
<p>{formatNumber(1000)}</p>
<p>{formatCurrency(99.99, 'EUR')}</p>
<p>{formatRelativeTime(pastDate)}</p>
```

### Missing Translation Handling

During development, missing translations are:
1. Logged to the console
2. Displayed with a special format: `[MISSING: keyName]`
3. Counted in the translation completion statistics

## Conclusion

Following these guidelines will help maintain a clean, consistent, and complete translation system across all supported languages in Policy Hub. Regular use of the provided tools will help identify and address translation issues early in development.
