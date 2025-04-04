
import auth from './auth.json';
import common from './common.json';
import dashboard from './dashboard.json';
import layout from './layout.json';
import codebook from './codebook.json';
import settings from './settings.json';
import errors from './errors.json';
import policyTranslations from './policies/index';
import finances from './finances.json';
import claims from './claims.json';
import modules from './modules.json';
import quotes from '../en/quotes.json'; // Use English quotes as fallback

// Merge all translation objects
const translations = {
  ...common,
  ...auth,
  ...dashboard,
  ...layout,
  ...codebook,
  ...settings,
  ...errors,
  ...policyTranslations,
  ...finances,
  ...claims,
  ...modules,
  quotes
};

export default translations;
