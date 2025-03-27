
import en from '../../../../locales/en.json';
import sr from '../../../../locales/sr/index';
import mk from '../../../../locales/mk/index';
import es from '../../../../locales/es/index';

interface ConsistencyIssues {
  onlyInEnglish: string[];
  notInEnglish: string[];
}

/**
 * Identifies consistency issues between translation files
 */
export const findConsistencyIssues = (): ConsistencyIssues => {
  // Check for keys only in English but not in other languages
  const onlyInEnglish = Object.keys(en).filter(key => 
    !Object.keys(sr).includes(key) || 
    !Object.keys(mk).includes(key) || 
    !Object.keys(es).includes(key)
  );
  
  // Check for keys in other languages but not in English
  const notInEnglish = [
    ...Object.keys(sr).filter(key => !Object.keys(en).includes(key)),
    ...Object.keys(mk).filter(key => !Object.keys(en).includes(key)),
    ...Object.keys(es).filter(key => !Object.keys(en).includes(key))
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  
  return {
    onlyInEnglish,
    notInEnglish
  };
};
